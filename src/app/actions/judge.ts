"use server";

import fs from "fs";
import tar from "tar-stream";
import Docker from "dockerode";
import prisma from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Readable, Writable } from "stream";
import { ExitCode, EditorLanguage, JudgeResult } from "@prisma/client";

const isRemote = process.env.DOCKER_HOST_MODE === "remote";

// Docker client initialization
const docker = isRemote
  ? new Docker({
    protocol: process.env.DOCKER_REMOTE_PROTOCOL as "https" | "http" | "ssh" | undefined,
    host: process.env.DOCKER_REMOTE_HOST,
    port: process.env.DOCKER_REMOTE_PORT,
    ca: fs.readFileSync(process.env.DOCKER_REMOTE_CA_PATH || "/certs/ca.pem"),
    cert: fs.readFileSync(process.env.DOCKER_REMOTE_CERT_PATH || "/certs/cert.pem"),
    key: fs.readFileSync(process.env.DOCKER_REMOTE_KEY_PATH || "/certs/key.pem"),
  })
  : new Docker({ socketPath: "/var/run/docker.sock" });

// Prepare Docker image environment
async function prepareEnvironment(image: string, tag: string) {
  const reference = `${image}:${tag}`;
  const filters = { reference: [reference] };
  const images = await docker.listImages({ filters });
  if (images.length === 0) await docker.pull(reference);
}

// Create Docker container with keep-alive
async function createContainer(
  image: string,
  tag: string,
  workingDir: string,
  memoryLimit?: number
) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"], // Keep container alive
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
  language: EditorLanguage,
  value: string,
): Promise<JudgeResult> {
  const session = await auth();
  if (!session) redirect("/sign-in");

  let container: Docker.Container | null = null;

  try {
    const config = await prisma.editorLanguageConfig.findUnique({
      where: { language },
      include: {
        dockerConfig: true,
      },
    });

    if (!config || !config.dockerConfig) {
      return {
        id: uuid(),
        output: "Configuration Error: Missing editor or docker configuration",
        exitCode: ExitCode.SE,
        executionTime: null,
        memoryUsage: null,
      };
    }

    const {
      image,
      tag,
      workingDir,
      memoryLimit,
      timeLimit,
      compileOutputLimit,
      runOutputLimit,
    } = config.dockerConfig;
    const { fileName, fileExtension } = config;
    const file = `${fileName}.${fileExtension}`;

    // Prepare the environment and create a container
    await prepareEnvironment(image, tag);
    container = await createContainer(image, tag, workingDir, memoryLimit);

    // Upload code to the container
    const tarStream = createTarStream(file, value);
    await container.putArchive(tarStream, { path: workingDir });

    // Compile the code
    const compileResult = await compile(container, file, fileName, compileOutputLimit);
    if (compileResult.exitCode === ExitCode.CE) {
      return compileResult;
    }

    // Run the code
    const runResult = await run(container, fileName, timeLimit, runOutputLimit);
    return runResult;
  } catch (error) {
    console.error(error);
    return {
      id: uuid(),
      output: "System Error",
      exitCode: ExitCode.SE,
      executionTime: null,
      memoryUsage: null,
    };
  } finally {
    if (container) {
      await container.kill();
      await container.remove();
    }
  }
}

async function compile(
  container: Docker.Container,
  file: string,
  fileName: string,
  maxOutput: number = 1 * 1024 * 1024
): Promise<JudgeResult> {
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
          result = {
            id: uuid(),
            output: stderr || "Compilation Error",
            exitCode: ExitCode.CE,
            executionTime: null,
            memoryUsage: null,
          };
        } else {
          result = {
            id: uuid(),
            output: stdout,
            exitCode: ExitCode.CS,
            executionTime: null,
            memoryUsage: null,
          };
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
async function run(
  container: Docker.Container,
  fileName: string,
  timeLimit: number = 1000,
  maxOutput: number = 1 * 1024 * 1024,
): Promise<JudgeResult> {
  const runExec = await container.exec({
    Cmd: [`./${fileName}`],
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true,
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
    runExec.start({ hijack: true }, (error, stream) => {
      if (error || !stream) {
        return reject({ output: "System Error", exitCode: ExitCode.SE });
      }

      stream.write("[2,7,11,15]\n9\n[3,2,4]\n6\n[3,3]\n6");
      stream.end();

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      // Timeout mechanism
      const timeoutId = setTimeout(async () => {
        resolve({
          id: uuid(),
          output: "Time Limit Exceeded",
          exitCode: ExitCode.TLE,
          executionTime: null,
          memoryUsage: null,
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
          result = {
            id: uuid(),
            output: stdout,
            exitCode: ExitCode.AC,
            executionTime: null,
            memoryUsage: null,
          };
        } else if (exitCode === 137) {
          result = {
            id: uuid(),
            output: stderr || "Memory Limit Exceeded",
            exitCode: ExitCode.MLE,
            executionTime: null,
            memoryUsage: null,
          };
        } else {
          result = {
            id: uuid(),
            output: stderr || "Runtime Error",
            exitCode: ExitCode.RE,
            executionTime: null,
            memoryUsage: null,
          };
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
