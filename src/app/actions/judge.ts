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
  if (images.length === 0) await docker.pull(reference);
}

// Create Docker container with keep-alive
async function createContainer(image: string, tag: string, workingDir: string, memoryLimit?: number) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"],  // Keep container alive
    WorkingDir: workingDir,
    HostConfig: {
      Memory: memoryLimit ? memoryLimit * 1024 * 1024 : undefined,
      MemorySwap: memoryLimit ? memoryLimit * 1024 * 1024 : undefined,
    },
    NetworkDisabled: true,
  });
  await container.start();
  return container;
}

// Create tar stream for code submission
function createTarStream(file: string, value: string) {
  const pack = tar.pack();
  pack.entry({ name: file }, value);
  pack.finalize();
  return Readable.from(pack);
}

export async function judge(
  language: string,
  value: string
): Promise<JudgeResult> {
  const { fileName, fileExtension, image, tag, workingDir, memoryLimit, timeLimit, compileOutputLimit, runOutputLimit } = LanguageConfigs[language];
  const file = `${fileName}.${fileExtension}`;
  let container: Docker.Container | undefined;

  try {
    await prepareEnvironment(image, tag);
    container = await createContainer(image, tag, workingDir, memoryLimit);
    const tarStream = createTarStream(file, value);
    await container.putArchive(tarStream, { path: workingDir });
    const compileResult = await compile(container, file, fileName, compileOutputLimit);
    if (compileResult.exitCode === ExitCode.CE) {
      return compileResult;
    }
    const runResult = await run(container, fileName, timeLimit, runOutputLimit);
    return runResult;
  } catch (error) {
    console.error(error);
    return { output: "System Error", exitCode: ExitCode.SE };
  } finally {
    if (container) {
      await container.kill();
      await container.remove();
    }
  }
}

async function compile(container: Docker.Container, file: string, fileName: string, maxOutput: number = 1 * 1024 * 1024): Promise<JudgeResult> {
  const compileExec = await container.exec({
    Cmd: ["gcc", "-O2", file, "-o", fileName],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<JudgeResult>((resolve, reject) => {
    compileExec.start({}, (error, stream) => {
      if (error || !stream) {
        return reject({ output: "System Error", exitCode: ExitCode.SE });
      }

      const stdoutChunks: string[] = [];
      let stdoutLength = 0;
      const stdoutStream = new Writable({
        write(chunk, _encoding, callback) {
          let text = chunk.toString();
          if (stdoutLength + text.length > maxOutput) {
            text = text.substring(0, maxOutput - stdoutLength);
            stdoutChunks.push(text);
            stdoutLength = maxOutput;
            callback();
            return;
          }
          stdoutChunks.push(text);
          stdoutLength += text.length;
          callback();
        },
      });

      const stderrChunks: string[] = [];
      let stderrLength = 0;
      const stderrStream = new Writable({
        write(chunk, _encoding, callback) {
          let text = chunk.toString();
          if (stderrLength + text.length > maxOutput) {
            text = text.substring(0, maxOutput - stderrLength);
            stderrChunks.push(text);
            stderrLength = maxOutput;
            callback();
            return;
          }
          stderrChunks.push(text);
          stderrLength += text.length;
          callback();
        },
      });

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      stream.on("end", async () => {
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        const exitCode = (await compileExec.inspect()).ExitCode;

        let result: JudgeResult;

        if (exitCode !== 0 || stderr) {
          result = { output: stderr || "Compilation Error", exitCode: ExitCode.CE };
        } else {
          result = { output: stdout, exitCode: ExitCode.CS };
        }

        resolve(result);
      });

      stream.on("error", () => {
        reject({ output: "System Error", exitCode: ExitCode.SE });
      });
    });
  });
}

// Run code and implement timeout
async function run(container: Docker.Container, fileName: string, timeLimit?: number, maxOutput: number = 1 * 1024 * 1024): Promise<JudgeResult> {
  const runExec = await container.exec({
    Cmd: [`./${fileName}`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<JudgeResult>((resolve, reject) => {
    const stdoutChunks: string[] = [];
    let stdoutLength = 0;
    const stdoutStream = new Writable({
      write(chunk, _encoding, callback) {
        let text = chunk.toString();
        if (stdoutLength + text.length > maxOutput) {
          text = text.substring(0, maxOutput - stdoutLength);
          stdoutChunks.push(text);
          stdoutLength = maxOutput;
          callback();
          return;
        }
        stdoutChunks.push(text);
        stdoutLength += text.length;
        callback();
      },
    });

    const stderrChunks: string[] = [];
    let stderrLength = 0;
    const stderrStream = new Writable({
      write(chunk, _encoding, callback) {
        let text = chunk.toString();
        if (stderrLength + text.length > maxOutput) {
          text = text.substring(0, maxOutput - stderrLength);
          stderrChunks.push(text);
          stderrLength = maxOutput;
          callback();
          return;
        }
        stderrChunks.push(text);
        stderrLength += text.length;
        callback();
      },
    });

    // Start the exec stream
    runExec.start({}, async (error, stream) => {
      if (error || !stream) {
        return reject({ output: "System Error", exitCode: ExitCode.SE });
      }

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      // Timeout mechanism
      const timeoutId = setTimeout(() => {
        // Timeout reached, kill the container
        container.kill();
        resolve({
          output: "Time Limit Exceeded",
          exitCode: ExitCode.TLE,
        });
      }, timeLimit);

      stream.on("end", async () => {
        clearTimeout(timeoutId); // Clear the timeout if the program finishes before the time limit
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        const exitCode = (await runExec.inspect()).ExitCode;

        let result: JudgeResult;

        // Exit code 0 means successful execution
        if (exitCode === 0) {
          result = { output: stdout, exitCode: ExitCode.AC };
        } else if (exitCode === 137) {
          result = { output: stderr || "Memory Limit Exceeded", exitCode: ExitCode.MLE };
        } else {
          result = { output: stderr || "Runtime Error", exitCode: ExitCode.RE };
        }

        resolve(result);
      });

      stream.on("error", () => {
        clearTimeout(timeoutId); // Clear timeout in case of error
        reject({ output: "System Error", exitCode: ExitCode.SE });
      });
    });
  });
}
