import "server-only";

import prisma from "@/lib/prisma";
import {
  JudgeRunStatus,
  JudgeStatus,
  Status,
} from "@/generated/client";

export const mapSubmissionStatusToJudgeStatus = (
  status: Status
): JudgeStatus | null => {
  switch (status) {
    case Status.CP:
      return JudgeStatus.COMPILING;
    case Status.CE:
      return JudgeStatus.COMPILATION_ERROR;
    case Status.RU:
      return JudgeStatus.RUNNING;
    case Status.AC:
      return JudgeStatus.ACCEPTED;
    case Status.WA:
      return JudgeStatus.WRONG_ANSWER;
    case Status.TLE:
      return JudgeStatus.TIME_LIMIT_EXCEEDED;
    case Status.MLE:
      return JudgeStatus.MEMORY_LIMIT_EXCEEDED;
    case Status.RE:
      return JudgeStatus.RUNTIME_ERROR;
    case Status.SE:
      return JudgeStatus.SYSTEM_ERROR;
    default:
      return null;
  }
};

export const mapSubmissionStatusToJudgeRunStatus = (
  status: Status
): JudgeRunStatus => {
  switch (status) {
    case Status.AC:
    case Status.RU:
      return JudgeRunStatus.ACCEPTED;
    case Status.WA:
      return JudgeRunStatus.WRONG_ANSWER;
    case Status.TLE:
      return JudgeRunStatus.TIME_LIMIT_EXCEEDED;
    case Status.MLE:
      return JudgeRunStatus.MEMORY_LIMIT_EXCEEDED;
    case Status.RE:
      return JudgeRunStatus.RUNTIME_ERROR;
    case Status.SE:
      return JudgeRunStatus.SYSTEM_ERROR;
    default:
      return JudgeRunStatus.SYSTEM_ERROR;
  }
};

export const getOrCreateJudge = async (
  submissionId: string,
  initialStatus: JudgeStatus = JudgeStatus.COMPILING
) => {
  const existing = await prisma.judge.findUnique({
    where: { submissionId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.judge.create({
    data: {
      submissionId,
      status: initialStatus,
    },
    select: { id: true },
  });
  return created.id;
};

export const updateJudgeBySubmission = async (
  submissionId: string,
  status: JudgeStatus,
  extra?: {
    compileOutput?: string | null;
    endTime?: Date | null;
  }
) => {
  const judgeId = await getOrCreateJudge(submissionId, status);

  await prisma.judge.update({
    where: { id: judgeId },
    data: {
      status,
      ...(extra?.compileOutput !== undefined
        ? { compileOutput: extra.compileOutput }
        : {}),
      ...(extra?.endTime !== undefined ? { endTime: extra.endTime } : {}),
    },
  });

  return judgeId;
};
