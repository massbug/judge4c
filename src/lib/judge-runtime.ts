import "server-only";

import { docker } from "@/app/actions/docker";
import { PassThrough } from "stream";
import tar from "tar-stream";

export const createStreamCollector = () => {
  let stdout = "";
  let stderr = "";

  const stdoutStream = new PassThrough();
  const stderrStream = new PassThrough();

  stdoutStream.on("data", (chunk) => {
    stdout += chunk.toString();
  });

  stderrStream.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  return {
    getStdout: () => stdout,
    getStderr: () => stderr,
    stdoutStream,
    stderrStream,
  };
};

export const uploadFileToContainer = async (
  containerId: string,
  sourceCode: string,
  fileName: string,
  filePath: string
) => {
  const container = docker.getContainer(containerId);

  // Ensure target directory exists before archive upload.
  const mkdirExec = await container.exec({
    Cmd: ["mkdir", "-p", filePath],
    AttachStdout: false,
    AttachStderr: false,
  });
  await mkdirExec.start({ hijack: false, stdin: false, Detach: false, Tty: false });

  const pack = tar.pack();
  pack.entry({ name: fileName }, sourceCode);
  pack.finalize();

  await container.putArchive(pack as unknown as NodeJS.ReadableStream, {
    path: filePath,
  });
};

export const deleteContainer = async (containerId: string) => {
  const container = docker.getContainer(containerId);
  await container.remove({ force: true });
};

export const prepareContainer = async (
  image: string,
  tag: string,
  memoryLimit: number,
  workingDir: string
) => {
  const imageWithTag = `${image}:${tag}`;
  const stream = await docker.pull(imageWithTag);

  await new Promise((resolve, reject) => {
    docker.modem.followProgress(stream, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

  const container = await docker.createContainer({
    Image: imageWithTag,
    Cmd: ["tail", "-f", "/dev/null"],
    WorkingDir: workingDir,
    HostConfig: {
      CpuCount: 1,
      Memory: memoryLimit,
      MemorySwap: 0,
      NetworkMode: "none",
    },
  });

  await container.start();
  return container.id;
};

export const prepareCompileExec = async (containerId: string, cmd: string[]) => {
  const container = docker.getContainer(containerId);

  const compileExec = await container.exec({
    Cmd: cmd,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
  });

  return compileExec.id;
};

export const prepareRunExec = async (containerId: string, cmd: string[]) => {
  const container = docker.getContainer(containerId);

  const runExec = await container.exec({
    Cmd: cmd,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
  });

  return runExec.id;
};

export const compile = async (compileExecId: string) => {
  const compileExec = docker.getExec(compileExecId);

  const stream = await compileExec.start({
    hijack: false,
    stdin: false,
    Detach: false,
    Tty: false,
  });

  const { getStdout, getStderr, stdoutStream, stderrStream } =
    createStreamCollector();
  docker.modem.demuxStream(stream, stdoutStream, stderrStream);

  return new Promise<{
    exitCode: number | null;
    stdout: string;
    stderr: string;
  }>((resolve) => {
    stream.on("end", async () => {
      const exitCode = (await compileExec.inspect()).ExitCode;
      resolve({
        exitCode,
        stdout: getStdout(),
        stderr: getStderr(),
      });
    });
  });
};

export const run = async (
  runExecId: string,
  stdin: string | null,
  timeLimit: number
) => {
  const runExec = docker.getExec(runExecId);
  const startTime = Date.now();
  const abortController = new AbortController();

  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, timeLimit);

  const stream = await runExec.start({
    hijack: stdin ? true : false,
    stdin: stdin ? true : false,
    Detach: false,
    Tty: false,
    abortSignal: abortController.signal,
  });

  if (stdin) {
    stream.write(stdin);
    stream.end();
  }

  const { getStdout, getStderr, stdoutStream, stderrStream } =
    createStreamCollector();
  docker.modem.demuxStream(stream, stdoutStream, stderrStream);

  return new Promise<{
    exitCode: number | null;
    stdout: string;
    stderr: string;
    timeUsage: number;
    isTimeout: boolean;
  }>((resolve) => {
    stream.on("end", async () => {
      clearTimeout(timeoutId);
      const endTime = Date.now();
      const timeUsage = endTime - startTime;
      const exitCode = (await runExec.inspect()).ExitCode;
      resolve({
        exitCode,
        stdout: getStdout(),
        stderr: getStderr(),
        timeUsage,
        isTimeout: abortController.signal.aborted,
      });
    });

    abortController.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      const endTime = Date.now();
      resolve({
        exitCode: null,
        stdout: getStdout(),
        stderr: getStderr(),
        timeUsage: endTime - startTime,
        isTimeout: true,
      });
    });
  });
};
