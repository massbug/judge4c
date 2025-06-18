import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function addTestcasesToAllProblems() {
  const problems = await prisma.problem.findMany();
  let totalCreated = 0;
  for (const problem of problems) {
    // 检查该题目是否已有测试用例
    const existing = await prisma.testcase.count({ where: { problemId: problem.id } });
    if (existing > 0) {
      continue; // 跳过已有测试用例的题目
    }
    // 随机生成2-3个测试用例
    const testcaseCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < testcaseCount; i++) {
      await prisma.testcase.create({
        data: {
          problemId: problem.id,
          data: {
            create: [
              { label: `输入A`, value: `${i + 1}`, index: 0 },
              { label: `输入B`, value: `${(i + 1) * 2}`, index: 1 },
            ],
          },
          expectedOutput: `${(i + 1) + (i + 1) * 2}`,
        },
      });
      totalCreated++;
    }
  }
  console.log(`已为${totalCreated}个题目补充测试用例。`);
}

addTestcasesToAllProblems()
  .catch((e) => {
    console.error("补充测试用例时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 