// app/actions/get-problem-data.ts
"use server";

import prisma from "@/lib/prisma";
import { Locale } from "@/generated/client";
import { serialize } from "next-mdx-remote/serialize";

export async function getProblemData(problemId: string, locale?: string) {
  const selectedLocale = locale as Locale;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      templates: true,
      testcases: {
        include: { inputs: true },
      },
      localizations: {
        where: {
          locale: selectedLocale,
        },
      },
    },
  });

  if (!problem) {
    throw new Error("Problem not found");
  }

  const getContent = (type: string) =>
    problem.localizations.find((loc) => loc.type === type)?.content || "";

  const rawDescription = getContent("DESCRIPTION");

  const mdxDescription = await serialize(rawDescription, {
    parseFrontmatter: false,
  });

  return {
    id: problem.id,
    displayId: problem.displayId,
    difficulty: problem.difficulty,
    isPublished: problem.isPublished,
    timeLimit: problem.timeLimit,
    memoryLimit: problem.memoryLimit,
    title: getContent("TITLE"),
    description: rawDescription,
    mdxDescription,
    solution: getContent("SOLUTION"),
    templates: problem.templates.map((t) => ({
      language: t.language,
      content: t.content,
    })),
    testcases: problem.testcases.map((tc) => ({
      id: tc.id,
      expectedOutput: tc.expectedOutput,
      inputs: tc.inputs.map((input) => ({
        name: input.name,
        value: input.value,
      })),
    })),
  };
}
