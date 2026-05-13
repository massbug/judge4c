"use server";

import prisma from "@/lib/prisma";
import { auth, signIn } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Language, Locale, Status } from "@/generated/client";
import { analyzeCode } from "@/app/actions/analyze-code";
import { inngest } from "@/inngest/client";
import {
  createSubmissionWithStatus,
  updateSubmissionStatus,
} from "@/lib/submission-status";

export const judge = async (
  problemId: string,
  language: Language,
  content: string,
  assignmentId?: string,
  locale: Locale = "zh"
): Promise<Status> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    await signIn();
    return Status.SE;
  }

  try {
    const actor = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!actor) {
      return Status.SE;
    }

    const createSystemErrorSubmission = async (
      message: string,
      options?: { assignmentId?: string | null }
    ) => {
      await createSubmissionWithStatus({
        language,
        content,
        status: Status.SE,
        message,
        userId,
        problemId,
        assignmentId: options?.assignmentId ?? null,
      });
    };

    let validatedAssignmentId: string | undefined;
    if (assignmentId) {
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: {
          id: true,
          published: true,
          course: {
            select: {
              archived: true,
              teacherId: true,
              enrollments: {
                where: { userId },
                select: { userId: true },
              },
            },
          },
          problems: {
            where: { problemId },
            select: { problemId: true },
          },
        },
      });

      if (!assignment) {
        await createSystemErrorSubmission("Assignment not found");
        return Status.SE;
      }

      const isTeacherOwner = assignment.course.teacherId === userId;
      const isStudentEnrolled = assignment.course.enrollments.length > 0;
      const canAccessAssignment =
        actor.role === "ADMIN" ||
        (actor.role === "TEACHER" && isTeacherOwner) ||
        (actor.role === "GUEST" && isStudentEnrolled);

      if (!canAccessAssignment) {
        await createSystemErrorSubmission("No permission for assignment", {
          assignmentId: assignment.id,
        });
        return Status.SE;
      }

      if (assignment.course.archived) {
        await createSystemErrorSubmission("Course is archived", {
          assignmentId: assignment.id,
        });
        return Status.SE;
      }

      if (!assignment.published && actor.role === "GUEST") {
        await createSystemErrorSubmission("Assignment is not published", {
          assignmentId: assignment.id,
        });
        return Status.SE;
      }

      if (assignment.problems.length === 0) {
        await createSystemErrorSubmission(
          "Problem does not belong to assignment",
          {
            assignmentId: assignment.id,
          }
        );
        return Status.SE;
      }

      validatedAssignmentId = assignment.id;
    }

    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      await createSystemErrorSubmission("Problem not found", {
        assignmentId: validatedAssignmentId,
      });
      return Status.SE;
    }

    const testcases = await prisma.testcase.findMany({
      where: {
        problemId,
      },
    });

    if (!testcases.length) {
      await createSystemErrorSubmission(
        "No testcases available for this problem",
        { assignmentId: validatedAssignmentId }
      );
      return Status.SE;
    }

    const dockerConfig = await prisma.dockerConfig.findUnique({
      where: {
        language,
      },
    });

    if (!dockerConfig) {
      await createSystemErrorSubmission(
        `Docker configuration not found for language: ${language}`,
        { assignmentId: validatedAssignmentId }
      );
      return Status.SE;
    }

    const submission = await createSubmissionWithStatus({
      language,
      content,
      status: Status.QD,
      userId,
      problemId,
      assignmentId: validatedAssignmentId,
    });

    const executeAnalyzeCode = async () => {
      await analyzeCode({
        content,
        submissionId: submission.id,
        locale,
      });
    }

    executeAnalyzeCode();

    try {
      await inngest.send({
        name: "submissions/create",
        data: {
          submissionId: submission.id,
        },
      });
    } catch (inngestError) {
      console.error("Failed to enqueue judge event:", inngestError);
      await updateSubmissionStatus(submission.id, Status.SE, {
        message: "Failed to enqueue judge event",
      });
      return Status.SE;
    }

    return Status.QD;
  } catch (error) {
    console.error("Error in judge:", error);
    return Status.SE;
  } finally {
    revalidatePath(`/problems/${problemId}`);
  }
};
