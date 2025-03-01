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

async function runCode(container: Docker.Container, fileName: string, timeout: number) {
  const runExec = await container.exec({
    Cmd: [`./${fileName}`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>((resolve, reject) => {
    let timeoutHandle: NodeJS.Timeout;

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

      timeoutHandle = setTimeout(async () => {
        try {
          console.warn("Execution timed out, stopping container...");
          await container.stop({ t: 0 });
          console.warn("Container stopped, removing...");
          await container.remove();
          reject(new Error("Execution timed out and container was removed"));
        } catch (stopError) {
          reject(new Error("Execution timed out, but failed to stop/remove container"));
        }
      }, timeout);

      stream.on("end", () => {
        clearTimeout(timeoutHandle);
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        resolve(stderr ? stdout + stderr : stdout);
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
  const { image, tag, fileName, extension, workingDir, timeout } = LanguageConfigs[language];
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

    return await runCode(container, fileName, timeout);
  } catch (error) {
    console.error("Error during judging:", error);
    throw error;
  } finally {
    if (container) {
      cleanupContainer(container).catch(() => { });
    }
  }
}
