"use server";

import tar from "tar-stream";
import Docker from "dockerode";
import { Readable, Writable } from "stream";
import { LanguageConfigs } from "@/config/judge";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

async function prepareEnvironment(image: string, tag: string) {
  const reference = `${image}:${tag}`;
  const filters = { reference: [reference] };
  const images = await docker.listImages({ filters });

  if (images.length === 0) {
    await docker.pull(reference);
  }
}

async function createContainer(image: string, tag: string, workingDir: string) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"],
    WorkingDir: workingDir,
  });

  await container.start();
  return container;
}

function createTarStream(filePath: string, value: string) {
  const pack = tar.pack();
  pack.entry({ name: filePath }, value);
  pack.finalize();
  return Readable.from(pack);
}

async function compileCode(container: Docker.Container, filePath: string, fileName: string) {
  const compileExec = await container.exec({
    Cmd: ["gcc", filePath, "-o", fileName],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>((resolve, reject) => {
    compileExec.start({}, (error, stream) => {
      if (error) {
        return reject(error);
      }
      if (!stream) {
        return reject(new Error("Stream is undefined"));
      }

      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      const stdoutStream = new Writable({
        write(chunk, encoding, callback) {
          stdoutChunks.push(chunk.toString());
          callback();
        }
      });

      const stderrStream = new Writable({
        write(chunk, encoding, callback) {
          stderrChunks.push(chunk.toString());
          callback();
        }
      });

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      stream.on("end", () => {
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        resolve(stderr ? stdout + stderr : stdout);
      });

      stream.on("error", reject);
    });
  });
}

async function monitorMemoryUsage(container: Docker.Container, memoryLimit: number, timeoutHandle: NodeJS.Timeout) {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const stats = await container.stats({ stream: false });
        const memoryUsage = stats.memory_stats.usage / (1024 * 1024); // Convert to MB

        console.log(`Memory usage: ${memoryUsage.toFixed(2)} MB`);

        if (memoryUsage > memoryLimit) {
          console.warn(`Memory limit exceeded: ${memoryUsage.toFixed(2)} MB > ${memoryLimit} MB`);
          clearInterval(interval);
          clearTimeout(timeoutHandle); // Clear the timeout timer
          await container.stop({ t: 0 });
          await container.remove();
          reject(new Error("Memory limit exceeded, container stopped and removed"));
        }
      } catch (error) {
        console.error("Error monitoring memory:", error);
        clearInterval(interval);
        reject(error);
      }
    }, 500); // Check every 500ms

    resolve();
  });
}

async function runCode(container: Docker.Container, fileName: string, timeout: number, memoryLimit: number) {
  const runExec = await container.exec({
    Cmd: [`./${fileName}`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>((resolve, reject) => {
    let timeoutHandle: NodeJS.Timeout;
    let memoryMonitor: Promise<void>;

    runExec.start({}, async (error, stream) => {
      if (error) {
        return reject(error);
      }
      if (!stream) {
        return reject(new Error("Stream is undefined"));
      }

      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      const stdoutStream = new Writable({
        write(chunk, encoding, callback) {
          stdoutChunks.push(chunk.toString());
          callback();
        }
      });

      const stderrStream = new Writable({
        write(chunk, encoding, callback) {
          stderrChunks.push(chunk.toString());
          callback();
        }
      });

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      // Timeout monitoring
      timeoutHandle = setTimeout(async () => {
        console.warn("Execution timed out, stopping container...");
        try {
          await container.stop({ t: 0 });
          await container.remove();
          reject(new Error("Execution timed out and container was removed"));
        } catch (stopError) {
          console.error('Error stopping/removing container:', stopError);
          reject(new Error("Execution timed out, but failed to stop/remove container"));
        }
      }, timeout); // Use the configured timeout

      // Memory monitoring
      memoryMonitor = monitorMemoryUsage(container, memoryLimit, timeoutHandle);

      stream.on("end", () => {
        clearTimeout(timeoutHandle);
        memoryMonitor.then(() => {
          const stdout = stdoutChunks.join("");
          const stderr = stderrChunks.join("");
          resolve(stderr ? stdout + stderr : stdout);
        }).catch(reject);
      });

      stream.on("error", (error) => {
        clearTimeout(timeoutHandle);
        reject(error);
      });
    });
  });
}

async function cleanupContainer(container: Docker.Container) {
  try {
    console.log("Stopping container...");
    await container.stop({ t: 0 });
    console.log("Removing container...");
    await container.remove();
  } catch (error) {
    console.error("Container cleanup failed:", error);
  }
}

export async function judge(language: string, value: string) {
  const { image, tag, fileName, extension, workingDir, timeout, memoryLimit } = LanguageConfigs[language];
  const filePath = `${fileName}.${extension}`;
  let container: Docker.Container | undefined;

  try {
    await prepareEnvironment(image, tag);
    container = await createContainer(image, tag, workingDir);

    const tarStream = createTarStream(filePath, value);
    await container.putArchive(tarStream, { path: workingDir });

    const compileOutput = await compileCode(container, filePath, fileName);
    if (compileOutput) {
      return compileOutput;
    }

    return await runCode(container, fileName, timeout, memoryLimit);
  } catch (error) {
    console.error("Error during judging:", error);
    throw error;
  } finally {
    if (container) {
      cleanupContainer(container).catch(() => { });
    }
  }
}
