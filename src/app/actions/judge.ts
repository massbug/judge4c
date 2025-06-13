"use server";

import { run } from "./run";
import Docker from "dockerode";
import prisma from "@/lib/prisma";
import { compile } from "./compile";
import { auth, signIn } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Language, Status } from "@/generated/client";
import { createContainer, createTarStream, prepareEnvironment } from "./docker";

export const judge = async (
  problemId: string,
  language: Language,
  content: string
): Promise<Status> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    await signIn();
    return Status.SE;
  }

  let container: Docker.Container | null = null;

  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      await prisma.submission.create({
        data: {
          language,
          content,
          status: Status.SE,
          message: "Problem not found",
          userId,
          problemId,
        },
      });
      return Status.SE;
    }

    const testcases = await prisma.testcase.findMany({
      where: {
        problemId,
      },
    });

    if (!testcases.length) {
      await prisma.submission.create({
        data: {
          language,
          content,
          status: Status.SE,
          message: "No testcases available for this problem",
          userId,
          problemId,
        },
      });
      return Status.SE;
    }

    const dockerConfig = await prisma.dockerConfig.findUnique({
      where: {
        language,
      },
    });

    if (!dockerConfig) {
      await prisma.submission.create({
        data: {
          language,
          content,
          status: Status.SE,
          message: `Docker configuration not found for language: ${language}`,
          userId,
          problemId,
        },
      });
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
      },
    });

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
