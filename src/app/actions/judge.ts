"use server";

import tar from "tar-stream";
import Docker from "dockerode";
import { Readable, Writable } from "stream";
import { ExitCode, JudgeResult, LanguageConfigs } from "@/config/judge";

// Docker client initialization
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// Prepare Docker image environment
async function prepareEnvironment(image: string, tag: string) {
  const reference = `${image}:${tag}`;
  const filters = { reference: [reference] };
  const images = await docker.listImages({ filters });

  if (images.length === 0) {
    await docker.pull(reference);
  }
}

// Create Docker container with keep-alive
async function createContainer(image: string, tag: string, workingDir: string) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"],  // Keep container alive
    WorkingDir: workingDir,
  });

  await container.start();
  return container;
}

// Create tar stream for code submission
function createTarStream(filePath: string, value: string) {
  const pack = tar.pack();
  pack.entry({ name: filePath }, value);
  pack.finalize();
  return Readable.from(pack);
}

// Compilation process handler
async function compileCode(
  container: Docker.Container,
  filePath: string,
  fileName: string
): Promise<JudgeResult> {
  const compileExec = await container.exec({
    Cmd: ["gcc", filePath, "-o", fileName],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<JudgeResult>((resolve, reject) => {
    compileExec.start({}, (error, stream) => {
      if (error) return reject({ output: error.message, exitCode: ExitCode.SE });
      if (!stream) return reject({ output: "No stream", exitCode: ExitCode.SE });

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

      stream.on("end", async () => {
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        const details = await compileExec.inspect();

        resolve({
          output: stderr || stdout,
          exitCode: details.ExitCode === 0 ? ExitCode.AC : ExitCode.CE
        });
      });

      stream.on("error", (error) => {
        reject({ output: error.message, exitCode: ExitCode.SE });
      });
    });
  });
}

// Memory monitoring utility
async function monitorMemoryUsage(
  container: Docker.Container,
  memoryLimit: number,
  timeoutHandle: NodeJS.Timeout
): Promise<void> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const stats = await container.stats({ stream: false });
        const memoryUsage = stats.memory_stats.usage / (1024 * 1024);

        if (memoryUsage > memoryLimit) {
          clearInterval(interval);
          clearTimeout(timeoutHandle);
          await container.stop({ t: 0 });
          await container.remove();
          reject({
            output: `Memory limit exceeded (${memoryUsage.toFixed(2)}MB)`,
            exitCode: ExitCode.MLE
          });
        }
      } catch (error) {
        clearInterval(interval);
        reject({
          output: `Memory monitoring failed: ${error}`,
          exitCode: ExitCode.SE
        });
      }
    }, 500);
  });
}

// Code execution handler
async function runCode(
  container: Docker.Container,
  fileName: string,
  timeout: number,
  memoryLimit: number
): Promise<JudgeResult> {
  const startTime = Date.now();
  const runExec = await container.exec({
    Cmd: [`./${fileName}`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<JudgeResult>((resolve, reject) => {
    let timeoutHandle: NodeJS.Timeout;

    runExec.start({}, async (error, stream) => {
      if (error) return reject({ output: error.message, exitCode: ExitCode.SE });
      if (!stream) return reject({ output: "No stream", exitCode: ExitCode.SE });

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

      // Timeout control
      timeoutHandle = setTimeout(async () => {
        try {
          await container.stop({ t: 0 });
          await container.remove();
          reject({
            output: `Timeout after ${timeout}ms`,
            exitCode: ExitCode.TLE
          });
        } catch (error) {
          reject({
            output: `Timeout handling failed: ${error}`,
            exitCode: ExitCode.SE
          });
        }
      }, timeout);

      // Memory monitoring
      monitorMemoryUsage(container, memoryLimit, timeoutHandle)
        .catch(reject);

      stream.on("end", async () => {
        clearTimeout(timeoutHandle);
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        const details = await runExec.inspect();

        resolve({
          output: stderr ? `${stdout}\n${stderr}` : stdout,
          exitCode: details.ExitCode === 0 ? ExitCode.AC : ExitCode.RE,
          executionTime: Date.now() - startTime
        });
      });

      stream.on("error", (error) => {
        reject({ output: error.message, exitCode: ExitCode.SE });
      });
    });
  });
}

// Cleanup resources
async function cleanupContainer(container: Docker.Container) {
  try {
    await container.stop({ t: 0 });
    await container.remove();
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
}

// Main judge function
export async function judge(
  language: string,
  value: string
): Promise<JudgeResult> {
  const config = LanguageConfigs[language];
  const filePath = `${config.fileName}.${config.extension}`;
  let container: Docker.Container | undefined;

  try {
    await prepareEnvironment(config.image, config.tag);
    container = await createContainer(config.image, config.tag, config.workingDir);

    // Inject code into container
    const tarStream = createTarStream(filePath, value);
    await container.putArchive(tarStream, { path: config.workingDir });

    // Compilation phase
    const compileResult = await compileCode(container, filePath, config.fileName);
    if (compileResult.exitCode !== ExitCode.AC) {
      return compileResult;
    }

    // Execution phase
    return await runCode(container, config.fileName, config.timeout, config.memoryLimit);
  } catch (error) {
    // Error handling
    console.error(error);

    const result: JudgeResult = {
      output: "Unknow Error",
      exitCode: ExitCode.SE,
    };

    return result;
  } finally {
    // Resource cleanup
    if (container) {
      cleanupContainer(container).catch(() => { });
    }
  }
}
