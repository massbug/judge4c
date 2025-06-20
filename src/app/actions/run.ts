import "server-only";

import {
  DockerConfig,
  Language,
  Problem,
  Status,
  Testcase,
} from "@/generated/client";
import Docker from "dockerode";
import prisma from "@/lib/prisma";
import { createLimitedStream, docker } from "./docker";

const getRunCmdForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return ["./main"];
    case Language.cpp:
      return ["./main"];
  }
};

const startRun = (
  runExec: Docker.Exec,
  runOutputLimit: number,
  submissionId: string,
  testcaseId: string,
  joinedInputs: string,
  timeLimit: number,
  memoryLimit: number,
  expectedOutput: string,
  isTrim: boolean,
): Promise<Status> => {
  return new Promise<Status>((resolve, reject) => {
    runExec.start({ hijack: true }, async (error, stream) => {
      if (error || !stream) {
        await prisma.testcaseResult.create({
          data: {
            isCorrect: false,
            submissionId,
            testcaseId,
          },
        });
        reject(Status.SE);
        return;
      }
      stream.write(joinedInputs);
      stream.end();

      const { stream: stdoutStream, buffers: stdoutBuffers } =
        createLimitedStream(runOutputLimit);
      const { stream: stderrStream } = createLimitedStream(runOutputLimit);
      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      const startTime = Date.now();
      const timeoutId = setTimeout(async () => {
        stream.destroy();
        await prisma.testcaseResult.create({
          data: {
            isCorrect: false,
            timeUsage: timeLimit,
            submissionId,
            testcaseId,
          },
        });
        resolve(Status.TLE);
      }, timeLimit);

      stream.on("end", async () => {
        clearTimeout(timeoutId);
        const stdout = stdoutBuffers.join("");
        const exitCode = (await runExec.inspect()).ExitCode;
        const timeUsage = Date.now() - startTime;
        if (exitCode === 0) {
          const isCorrect = isTrim ? stdout.trim() === expectedOutput.trim() : stdout === expectedOutput;
          await prisma.testcaseResult.create({
            data: {
              isCorrect,
              output: stdout,
              timeUsage,
              submissionId,
              testcaseId,
            },
          });
          if (isCorrect) {
            resolve(Status.RU);
          } else {
            resolve(Status.WA);
          }
        } else if (exitCode === 137) {
          await prisma.testcaseResult.create({
            data: {
              isCorrect: false,
              timeUsage,
              memoryUsage: memoryLimit,
              submissionId,
              testcaseId,
            },
          });
          resolve(Status.MLE);
        } else {
          await prisma.testcaseResult.create({
            data: {
              isCorrect: false,
              submissionId,
              testcaseId,
            },
          });
          resolve(Status.RE);
        }
      });

      stream.on("error", async () => {
        clearTimeout(timeoutId);
        await prisma.testcaseResult.create({
          data: {
            isCorrect: false,
            submissionId,
            testcaseId,
          },
        });
        reject(Status.SE);
      });
    });
  });
};

const executeRun = async (
  container: Docker.Container,
  runCmd: string[],
  runOutputLimit: number,
  submissionId: string,
  timeLimit: number,
  memoryLimit: number,
  testcases: Testcase[],
  isTrim: boolean
): Promise<Status> => {
  for (const testcase of testcases) {
    const inputs = await prisma.testcaseInput.findMany({
      where: {
        testcaseId: testcase.id,
      },
    });
    if (!inputs) {
      await prisma.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: Status.SE,
          message: "No inputs for testcase",
        },
      });
      return Status.SE;
    }
    const sortedInputs = inputs.sort((a, b) => a.index - b.index);
    const joinedInputs = sortedInputs.map((i) => i.value).join("\n");

    const runExec = await container.exec({
      Cmd: runCmd,
      AttachStdout: true,
      AttachStderr: true,
      AttachStdin: true,
    });

    const status = await startRun(
      runExec,
      runOutputLimit,
      submissionId,
      testcase.id,
      joinedInputs,
      timeLimit,
      memoryLimit,
      testcase.expectedOutput,
      isTrim
    );

    if (status !== Status.RU) {
      await prisma.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status,
        },
      });
      return status;
    }
  }

  const testcaseResults = await prisma.testcaseResult.findMany({
    where: {
      submissionId,
    },
  });

  const filteredTimeUsages = testcaseResults
    .map((result) => result.timeUsage)
    .filter((time) => time !== null);

  const maxTimeUsage =
    filteredTimeUsages.length > 0 ? Math.max(...filteredTimeUsages) : undefined;

  const maxMemoryUsage = (
    await container.stats({
      stream: false,
      "one-shot": true,
    })
  ).memory_stats.max_usage;

  await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      status: Status.AC,
      timeUsage: maxTimeUsage,
      memoryUsage: maxMemoryUsage,
    },
  });

  return Status.AC;
};

export const run = async (
  container: Docker.Container,
  language: Language,
  submissionId: string,
  config: DockerConfig,
  problem: Problem,
  testcases: Testcase[]
): Promise<Status> => {
  const { runOutputLimit } = config;
  const { timeLimit, memoryLimit, isTrim } = problem;

  await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      status: Status.RU,
    },
  });

  const runCmd = getRunCmdForLanguage(language);

  return await executeRun(
    container,
    runCmd,
    runOutputLimit,
    submissionId,
    timeLimit,
    memoryLimit,
    testcases,
    isTrim
  );
};
