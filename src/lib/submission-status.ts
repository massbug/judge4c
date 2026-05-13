import "server-only";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status, type Submission } from "@/generated/client";
import { pusherServer } from "@/lib/soketi-server";

const publishStatusUpdate = async (submission: Submission) => {
  revalidatePath(`/problems/${submission.problemId}`);

  if (!pusherServer) return;

  const payload = {
    submissionId: submission.id,
    problemId: submission.problemId,
    status: submission.status,
    timestamp: new Date().toISOString(),
  };

  await pusherServer.trigger(`submission-${submission.id}`, "status-update", payload);
  await pusherServer.trigger(`problem-${submission.problemId}`, "status-update", payload);
};

export const createSubmissionWithStatus = async (data: {
  language: Submission["language"];
  content: string;
  status: Status;
  userId: string;
  problemId: string;
  assignmentId?: string | null;
  message?: string | null;
}) => {
  const submission = await prisma.submission.create({
    data: {
      language: data.language,
      content: data.content,
      status: data.status,
      userId: data.userId,
      problemId: data.problemId,
      assignmentId: data.assignmentId ?? null,
      message: data.message ?? null,
    },
  });

  await publishStatusUpdate(submission);
  return submission;
};

export const updateSubmissionStatus = async (
  submissionId: string,
  status: Status,
  extra?: {
    message?: string | null;
    timeUsage?: number | null;
    memoryUsage?: number | null;
  }
) => {
  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status,
      ...(extra?.message !== undefined ? { message: extra.message } : {}),
      ...(extra?.timeUsage !== undefined ? { timeUsage: extra.timeUsage } : {}),
      ...(extra?.memoryUsage !== undefined ? { memoryUsage: extra.memoryUsage } : {}),
    },
  });

  await publishStatusUpdate(submission);
  return submission;
};
