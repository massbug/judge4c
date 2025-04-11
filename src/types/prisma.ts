import prisma from "@/lib/prisma";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export async function getAllProblems() {
  return await prisma.problem.findMany({
    include: {
      templates: true,
      testcases: {
        include: {
          data: true,
        },
      },
    },
  });
}

export type ProblemWithDetails = ThenArg<
  ReturnType<typeof getAllProblems>
>[number];

export async function getAllProblemsWithTestcases() {
  return await prisma.problem.findMany({
    include: {
      testcases: {
        include: {
          data: true,
        },
      },
    },
  });
}

export type ProblemWithTestcases = ThenArg<
  ReturnType<typeof getAllProblemsWithTestcases>
>[number];

export async function getAllTestcases() {
  return await prisma.testcase.findMany({
    include: {
      data: true,
    },
  });
}

export type TestcaseWithDetails = ThenArg<
  ReturnType<typeof getAllTestcases>
>;
