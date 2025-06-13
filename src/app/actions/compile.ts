import "server-only";

import Docker from "dockerode";
import prisma from "@/lib/prisma";
import { createLimitedStream, docker } from "./docker";
import { type DockerConfig, Language, Status } from "@/generated/client";

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
          resolve(Status.CS);
        } else {
          await prisma.submission.update({
            where: {
              id: submissionId,
            },
            data: {
              message: stderr,
            },
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

  await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      status: Status.CP,
    },
  });

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

  await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      status,
    },
  });

  return status;
};
