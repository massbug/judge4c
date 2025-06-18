import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function checkTestcaseData() {
  console.log("检查数据库中的测试用例数据...");

  // 检查测试用例总数
  const totalTestcases = await prisma.testcase.count();
  console.log(`总测试用例数: ${totalTestcases}`);

  // 检查测试用例结果总数
  const totalResults = await prisma.testcaseResult.count();
  console.log(`总测试用例结果数: ${totalResults}`);

  if (totalTestcases === 0) {
    console.log("没有测试用例数据，需要先创建测试用例...");
    return;
  }

  if (totalResults === 0) {
    console.log("没有测试用例结果数据，正在创建...");
    await createTestcaseResults();
    return;
  }

  // 检查错误结果数
  const wrongResults = await prisma.testcaseResult.count({
    where: { isCorrect: false }
  });
  console.log(`错误结果数: ${wrongResults}`);

  // 获取所有测试用例结果，按问题分组
  const testcaseResults = await prisma.testcaseResult.findMany({
    include: {
      testcase: {
        include: {
          problem: true,
        },
      },
    },
  });

  const problemMap = new Map<string, { 
    total: number; 
    wrong: number; 
    title: string;
  }>();

  testcaseResults.forEach((result) => {
    const problemId = result.testcase.problemId;
    const problemTitle = result.testcase.problem.title;
    const isWrong = !result.isCorrect;

    if (!problemMap.has(problemId)) {
      problemMap.set(problemId, {
        total: 0,
        wrong: 0,
        title: problemTitle,
      });
    }

    const stats = problemMap.get(problemId)!;
    stats.total++;
    if (isWrong) {
      stats.wrong++;
    }
  });

  console.log("\n各题目的统计信息:");
  Array.from(problemMap.entries()).forEach(([problemId, stats]) => {
    const errorRate = (stats.wrong / stats.total) * 100;
    console.log(`题目: ${stats.title}`);
    console.log(`  总尝试次数: ${stats.total}`);
    console.log(`  错误次数: ${stats.wrong}`);
    console.log(`  错误率: ${errorRate.toFixed(2)}%`);
    console.log(`  是否满足易错题条件(错误率>30%且尝试次数>=3): ${errorRate > 30 && stats.total >= 3 ? '是' : '否'}`);
    console.log("---");
  });

  // 筛选易错题
  const difficultProblems = Array.from(problemMap.entries())
    .map(([problemId, stats]) => ({
      id: problemId,
      title: stats.title,
      totalAttempts: stats.total,
      wrongAttempts: stats.wrong,
      errorRate: (stats.wrong / stats.total) * 100,
    }))
    .filter((problem) => 
      problem.errorRate > 30 && 
      problem.totalAttempts >= 3
    )
    .sort((a, b) => b.errorRate - a.errorRate);

  console.log(`\n符合条件的易错题数量: ${difficultProblems.length}`);
  
  if (difficultProblems.length > 0) {
    console.log("易错题列表:");
    difficultProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title} - 错误率: ${problem.errorRate.toFixed(2)}% (${problem.wrongAttempts}/${problem.totalAttempts})`);
    });
  }
}

async function createTestcaseResults() {
  console.log("开始创建测试用例结果数据...");

  // 获取所有提交记录
  const submissions = await prisma.submission.findMany();
  console.log(`找到 ${submissions.length} 个提交记录`);

  let createdCount = 0;

  for (const submission of submissions) {
    // 获取该题目的测试用例
    const testcases = await prisma.testcase.findMany({
      where: { problemId: submission.problemId },
    });

    if (testcases.length === 0) {
      console.log(`题目 ${submission.problemId} 没有测试用例，跳过`);
      continue;
    }

    for (const testcase of testcases) {
      // 检查是否已存在测试用例结果
      const exists = await prisma.testcaseResult.findFirst({
        where: {
          submissionId: submission.id,
          testcaseId: testcase.id,
        },
      });

      if (!exists) {
        // 根据提交状态决定测试用例结果是否正确
        const isCorrect = submission.status === "AC";
        
        await prisma.testcaseResult.create({
          data: {
            isCorrect,
            output: isCorrect ? "正确答案" : "错误答案",
            executionTime: Math.floor(Math.random() * 1000) + 1,
            memoryUsage: Math.floor(Math.random() * 128) + 1,
            submissionId: submission.id,
            testcaseId: testcase.id,
          },
        });
        createdCount++;
      }
    }
  }

  console.log(`创建了 ${createdCount} 个测试用例结果`);
}

checkTestcaseData()
  .catch((e) => {
    console.error("检查数据时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 