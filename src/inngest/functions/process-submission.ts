import "server-only";

import prisma from "@/lib/prisma";
import { JudgeStatus, Language, Status } from "@/generated/client";
import { inngest } from "@/inngest/client";
import { docker, prepareEnvironment } from "@/app/actions/docker";
import {
  compile,
  deleteContainer,
  prepareCompileExec,
  prepareContainer,
  prepareRunExec,
  run,
  uploadFileToContainer,
} from "../../lib/judge-runtime";
import { updateSubmissionStatus } from "@/lib/submission-status";
import {
  getOrCreateJudge,
  mapSubmissionStatusToJudgeRunStatus,
  updateJudgeBySubmission,
} from "@/lib/judge-trace";

const getFileNameForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return "main.c";
    case Language.cpp:
      return "main.cpp";
  }
};

const finalizeWithSystemError = async (submissionId: string, message: string) => {
  await updateSubmissionStatus(submissionId, Status.SE, { message });
  await updateJudgeBySubmission(submissionId, JudgeStatus.SYSTEM_ERROR, {
    endTime: new Date(),
  });
};

export const processSubmission = inngest.createFunction(
  {
    id: "process-submission",
    name: "Process Submission",
    retries: 0,
  },
  {
    event: "submissions/create",
  },
  async ({ event, step }) => {
    const submissionId = await step.run("parse-event-submission-id", async () => {
      return String((event.data as { submissionId?: string }).submissionId ?? "");
    });
    if (!submissionId) return;

    const submission = await step.run("load-submission", async () => {
      return prisma.submission.findUnique({
        where: { id: submissionId },
      });
    });
    if (!submission) return;

    let containerId: string | null = null;

    try {
      const problem = await prisma.problem.findUnique({
        where: { id: submission.problemId },
      });
      if (!problem) {
        await finalizeWithSystemError(submission.id, "Problem not found");
        return;
      }

      const testcases = await prisma.testcase.findMany({
        where: { problemId: submission.problemId },
      });
      if (!testcases.length) {
        await finalizeWithSystemError(
          submission.id,
          "No testcases available for this problem"
        );
        return;
      }

      const dockerConfig = await prisma.dockerConfig.findUnique({
        where: { language: submission.language },
      });
      if (!dockerConfig) {
        await finalizeWithSystemError(
          submission.id,
          `Docker configuration not found for language: ${submission.language}`
        );
        return;
      }

      const dockerPrepared = await step.run("prepare-docker-image", async () => {
        return prepareEnvironment(dockerConfig.image, dockerConfig.tag);
      });
      if (!dockerPrepared) {
        await finalizeWithSystemError(
          submission.id,
          `Docker image not found: ${dockerConfig.image}:${dockerConfig.tag}`
        );
        return;
      }

      containerId = await step.run("prepare-container", async () => {
        return prepareContainer(
          dockerConfig.image,
          dockerConfig.tag,
          problem.memoryLimit,
          dockerConfig.workingDir
        );
      });

      await step.run("upload-source-to-container", async () => {
        await uploadFileToContainer(
          containerId!,
          submission.content,
          getFileNameForLanguage(submission.language),
          dockerConfig.workingDir
        );
      });

      const compileResult = await step.run("compile-submission", async () => {
        await updateJudgeBySubmission(submission.id, JudgeStatus.COMPILING);
        await updateSubmissionStatus(submission.id, Status.CP);

        const compileExecId = await prepareCompileExec(
          containerId!,
          submission.language === Language.c
            ? ["gcc", "-O2", "main.c", "-o", "main"]
            : ["g++", "-O2", "main.cpp", "-o", "main"]
        );
        return compile(compileExecId);
      });

      if (compileResult.exitCode !== 0) {
        await updateSubmissionStatus(submission.id, Status.CE, {
          message: compileResult.stderr,
        });
        await updateJudgeBySubmission(submission.id, JudgeStatus.COMPILATION_ERROR, {
          compileOutput: compileResult.stderr,
          endTime: new Date(),
        });
        return;
      }

      await updateSubmissionStatus(submission.id, Status.CS);
      const judgeId = await getOrCreateJudge(submission.id, JudgeStatus.RUNNING);
      await prisma.judgeRun.deleteMany({ where: { judgeId } });
      await updateJudgeBySubmission(submission.id, JudgeStatus.RUNNING);
      await updateSubmissionStatus(submission.id, Status.RU);

      let maxTimeUsage: number | null = null;
      for (const testcase of testcases) {
        const inputs = await prisma.testcaseInput.findMany({
          where: { testcaseId: testcase.id },
          orderBy: { index: "asc" },
        });
        const stdin = inputs.map((i) => i.value).join("\n");

        const runExecId = await step.run(`prepare-run-exec-${testcase.id}`, async () => {
          return prepareRunExec(containerId!, ["./main"]);
        });
        const runResult = await step.run(`run-testcase-${testcase.id}`, async () => {
          return run(runExecId, stdin || null, problem.timeLimit);
        });

        const { exitCode, stdout, stderr, timeUsage, isTimeout } = runResult;

        let status: Status = Status.SE;
        let isCorrect = false;
        let memoryUsage: number | null = null;

        if (isTimeout) {
          status = Status.TLE;
        } else if (exitCode === 0) {
          isCorrect = problem.isTrim
            ? stdout.trim() === testcase.expectedOutput.trim()
            : stdout === testcase.expectedOutput;
          status = isCorrect ? Status.RU : Status.WA;
        } else if (exitCode === 137) {
          status = Status.MLE;
          memoryUsage = problem.memoryLimit;
        } else {
          status = Status.RE;
        }

        await prisma.judgeRun.create({
          data: {
            judgeId,
            testcaseId: testcase.id,
            status: mapSubmissionStatusToJudgeRunStatus(status),
            timeUsage,
            memoryUsage: memoryUsage ?? undefined,
            stdin,
            stdout,
            stderr,
          },
        });

        if (maxTimeUsage === null || timeUsage > maxTimeUsage) {
          maxTimeUsage = timeUsage;
        }

        if (status !== Status.RU) {
          const judgeStatusMap: Record<Status, JudgeStatus> = {
            [Status.PD]: JudgeStatus.SYSTEM_ERROR,
            [Status.QD]: JudgeStatus.SYSTEM_ERROR,
            [Status.CP]: JudgeStatus.COMPILING,
            [Status.CE]: JudgeStatus.COMPILATION_ERROR,
            [Status.CS]: JudgeStatus.COMPILING,
            [Status.RU]: JudgeStatus.RUNNING,
            [Status.TLE]: JudgeStatus.TIME_LIMIT_EXCEEDED,
            [Status.MLE]: JudgeStatus.MEMORY_LIMIT_EXCEEDED,
            [Status.RE]: JudgeStatus.RUNTIME_ERROR,
            [Status.AC]: JudgeStatus.ACCEPTED,
            [Status.WA]: JudgeStatus.WRONG_ANSWER,
            [Status.SE]: JudgeStatus.SYSTEM_ERROR,
          };

          await updateSubmissionStatus(submission.id, status);
          await updateJudgeBySubmission(submission.id, judgeStatusMap[status], {
            endTime: new Date(),
          });
          return;
        }
      }

      const stats = await step.run("read-container-stats", async () => {
        const container = docker.getContainer(containerId!);
        return container.stats({ stream: false, "one-shot": true });
      });

      const maxMemoryUsage = stats.memory_stats.max_usage;

      await updateSubmissionStatus(submission.id, Status.AC, {
        timeUsage: maxTimeUsage,
        memoryUsage: maxMemoryUsage,
      });
      await updateJudgeBySubmission(submission.id, JudgeStatus.ACCEPTED, {
        endTime: new Date(),
      });
    } catch (error) {
      console.error("inngest process submission failed:", error);
      await finalizeWithSystemError(submission.id, "Judge execution failed");
    } finally {
      if (containerId) {
        await step.run("cleanup-container", async () => {
          await deleteContainer(containerId!);
        });
      }
    }
  }
);
