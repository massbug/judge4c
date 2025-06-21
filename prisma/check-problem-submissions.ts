import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function checkProblemSubmissions() {
  console.log("检查所有题目的提交记录情况...");

  // 获取所有题目
  const problems = await prisma.problem.findMany({
    orderBy: { displayId: 'asc' }
  });

  console.log(`总题目数: ${problems.length}`);

  for (const problem of problems) {
    // 统计该题目的提交记录
    const submissionCount = await prisma.submission.count({
      where: { problemId: problem.id }
    });

    // 统计该题目的完成情况
    const completedCount = await prisma.submission.count({
      where: { 
        problemId: problem.id,
        status: "AC"
      }
    });

    // 查询时包含 localizations
    const problems = await prisma.problem.findMany({
      include: {
        localizations: {
          where: { type: "TITLE" },
          select: { content: true }
        }
      }
    });

    problems.forEach(problem => {
      const title = problem.localizations[0]?.content || "无标题";
      console.log(`题目${problem.displayId} (${title}): ...`);
    });

  // 统计有提交记录的题目数量
  const problemsWithSubmissions = await prisma.problem.findMany({
    where: {
      submissions: {
        some: {}
      }
    }
  });

  console.log(`\n有提交记录的题目数量: ${problemsWithSubmissions.length}`);
  console.log("有提交记录的题目编号:");
  problemsWithSubmissions.forEach(p => {
    console.log(`  ${p.displayId}`);
  });
}

checkProblemSubmissions()
  .catch((e) => {
    console.error("检查数据时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })};