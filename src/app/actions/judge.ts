"use server";

import { run } from "./run";
import Docker from "dockerode";
import prisma from "@/lib/prisma";
import { compile } from "./compile";
import { auth, signIn } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Language, Status } from "@/generated/client";
import { analyzeCode } from "@/app/actions/analyze-code";
import { createContainer, createTarStream, prepareEnvironment } from "./docker";

export const judge = async (
  problemId: string,
  language: Language,
  content: string,
  assignmentId?: string
): Promise<Status> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    await signIn();
    return Status.SE;
  }

  let container: Docker.Container | null = null;

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
      await prisma.submission.create({
        data: {
          language,
          content,
          status: Status.SE,
          message,
          userId,
          problemId,
          assignmentId: options?.assignmentId ?? null,
        },
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

    const dockerPrepared = await prepareEnvironment(
      dockerConfig.image,
      dockerConfig.tag
    );

    if (!dockerPrepared) {
      console.error(
        "Docker image not found:",
        dockerConfig.image,
        ":",
        dockerConfig.tag
      );
      await prisma.submission.create({
        data: {
          language,
          content,
          status: Status.SE,
          message: `Docker image not found: ${dockerConfig.image}:${dockerConfig.tag}`,
          userId,
          problemId,
          assignmentId: validatedAssignmentId,
        },
      });
      return Status.SE;
    }

    const submission = await prisma.submission.create({
      data: {
        language,
        content,
        status: Status.PD,
        userId,
        problemId,
        assignmentId: validatedAssignmentId,
      },
    });

    const executeAnalyzeCode = async () => {
      await analyzeCode({
        content,
        submissionId: submission.id,
      });
    }

    executeAnalyzeCode()

    // Upload code to the container
    const tarStream = createTarStream(
      getFileNameForLanguage(language),
      content
    );

    container = await createContainer(dockerConfig, problem.memoryLimit);
    await container.putArchive(tarStream, { path: dockerConfig.workingDir });

    // Compile the code
    const compileStatus = await compile(
      container,
      language,
      submission.id,
      dockerConfig
    );

    if (compileStatus !== "CS") return compileStatus;

    const runStatus = await run(
      container,
      language,
      submission.id,
      dockerConfig,
      problem,
      testcases
    );

    return runStatus;
  } catch (error) {
    console.error("Error in judge:", error);
    return Status.SE;
  } finally {
    revalidatePath(`/problems/${problemId}`);
    if (container) {
      try {
        await container.kill();
        await container.remove();
      } catch (error) {
        console.error("Container cleanup failed:", error);
      }
    }
  }
};

const getFileNameForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return "main.c";
    case Language.cpp:
      return "main.cpp";
  }
};
