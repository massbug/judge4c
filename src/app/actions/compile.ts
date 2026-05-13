import "server-only";

import Docker from "dockerode";
import { createLimitedStream, docker } from "./docker";
import {
  type DockerConfig,
  JudgeStatus,
  Language,
  Status,
} from "@/generated/client";
import { updateSubmissionStatus } from "@/lib/submission-status";
import { updateJudgeBySubmission } from "@/lib/judge-trace";

const getCompileCmdForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return ["gcc", "-O2", "main.c", "-o", "main"];
    case Language.cpp:
      return ["g++", "-O2", "main.cpp", "-o", "main"];
  }
};

const executeCompilation = async (
  submissionId: string,
  compileExec: Docker.Exec,
  compileOutputLimit: number
): Promise<Status> => {
  return new Promise<Status>((resolve, reject) => {
    compileExec.start({}, async (error, stream) => {
      if (error || !stream) {
        reject(Status.SE);
        return;
      }

      const { stream: stdoutStream } = createLimitedStream(compileOutputLimit);
      const { stream: stderrStream, buffers: stderrBuffers } =
        createLimitedStream(compileOutputLimit);

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      stream.on("end", async () => {
        const stderr = stderrBuffers.join("");
        const exitCode = (await compileExec.inspect()).ExitCode;

        if (exitCode === 0) {
          await updateJudgeBySubmission(submissionId, JudgeStatus.COMPILING);
          resolve(Status.CS);
        } else {
          await updateSubmissionStatus(submissionId, Status.CE, {
            message: stderr,
          });
          await updateJudgeBySubmission(submissionId, JudgeStatus.COMPILATION_ERROR, {
            compileOutput: stderr,
            endTime: new Date(),
          });
          resolve(Status.CE);
        }
      });

      stream.on("error", async () => {
        reject(Status.SE);
      });
    });
  });
};

export const compile = async (
  container: Docker.Container,
  language: Language,
  submissionId: string,
  config: DockerConfig
): Promise<Status> => {
  const { compileOutputLimit } = config;

  await updateJudgeBySubmission(submissionId, JudgeStatus.COMPILING);
  await updateSubmissionStatus(submissionId, Status.CP);

  const compileCmd = getCompileCmdForLanguage(language);

  const compileExec = await container.exec({
    Cmd: compileCmd,
    AttachStdout: true,
    AttachStderr: true,
  });

  const status = await executeCompilation(
    submissionId,
    compileExec,
    compileOutputLimit
  );

  if (status !== Status.CE) {
    await updateSubmissionStatus(submissionId, status);
  }

  return status;
};
