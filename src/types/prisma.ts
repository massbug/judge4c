import prisma from "@/lib/prisma";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export async function getTestcaseWithData() {
  const testcases = await prisma.testcase.findMany({ include: { data: true } });
  return testcases;
}

export type TestcaseWithData = ThenArg<ReturnType<typeof getTestcaseWithData>>;
