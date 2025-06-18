import { PrismaClient, Status } from "@/generated/client";
const prisma = new PrismaClient();

async function fillTestcaseResults() {
  const submissions = await prisma.submission.findMany();
  let count = 0;
  for (const submission of submissions) {
    const testcases = await prisma.testcase.findMany({
      where: { problemId: submission.problemId },
    });
    for (const testcase of testcases) {
      // 检查是否已存在，避免重复
      const exists = await prisma.testcaseResult.findFirst({
        where: {
          submissionId: submission.id,
          testcaseId: testcase.id,
        },
      });
      if (!exists) {
        await prisma.testcaseResult.create({
          data: {
            isCorrect: submission.status === Status.AC,
            output: submission.status === Status.AC ? "正确答案" : "错误答案",
            executionTime: Math.floor(Math.random() * 1000) + 1,
            memoryUsage: Math.floor(Math.random() * 128) + 1,
            submissionId: submission.id,
            testcaseId: testcase.id,
          },
        });
        count++;
      }
    }
  }
  console.log(`已为 ${count} 个提交生成测试用例结果`);
}

fillTestcaseResults().finally(() => prisma.$disconnect()); 