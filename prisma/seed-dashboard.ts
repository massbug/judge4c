import { PrismaClient, Status, EditorLanguage } from "@/generated/client";

const prisma = new PrismaClient();

async function createDashboardTestData() {
  console.log("开始创建 Teacher Dashboard 测试数据...");

  // 获取现有的用户和题目
  const users = await prisma.user.findMany();
  const problems = await prisma.problem.findMany();

  if (users.length === 0) {
    console.log("没有找到用户，请先运行主种子文件");
    return;
  }

  if (problems.length === 0) {
    console.log("没有找到题目，请先运行主种子文件");
    return;
  }

  console.log(`找到 ${users.length} 个用户和 ${problems.length} 个题目`);

  // 为每个用户创建一些提交记录
  const submissions = [];
  for (const user of users) {
    // 为每个用户随机选择2-5个题目进行提交
    const userProblems = problems.slice(0, Math.floor(Math.random() * 4) + 2);
    
    for (const problem of userProblems) {
      // 创建1-3次提交记录
      const submissionCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < submissionCount; i++) {
        const submission = await prisma.submission.create({
          data: {
            language: Math.random() > 0.5 ? EditorLanguage.c : EditorLanguage.cpp,
            code: `// 用户 ${user.name} 的代码\n#include <stdio.h>\nint main() { return 0; }`,
            status: getRandomStatus(),
            message: "测试提交",
            executionTime: Math.floor(Math.random() * 1000) + 1,
            memoryUsage: Math.floor(Math.random() * 128) + 1,
            userId: user.id,
            problemId: problem.id,
          },
        });
        submissions.push(submission);
      }
    }
  }

  console.log(`创建了 ${submissions.length} 个提交记录`);

  // 为每个提交创建测试用例结果
  const testcaseResults = [];
  for (const submission of submissions) {
    // 获取该题目的测试用例
    const testcases = await prisma.testcase.findMany({
      where: { problemId: submission.problemId },
    });

    for (const testcase of testcases) {
      const isCorrect = Math.random() > 0.3; // 70% 的正确率
      
      const testcaseResult = await prisma.testcaseResult.create({
        data: {
          isCorrect,
          output: isCorrect ? "正确答案" : "错误答案",
          executionTime: Math.floor(Math.random() * 1000) + 1,
          memoryUsage: Math.floor(Math.random() * 128) + 1,
          submissionId: submission.id,
          testcaseId: testcase.id,
        },
      });
      testcaseResults.push(testcaseResult);
    }
  }

  console.log(`创建了 ${testcaseResults.length} 个测试用例结果`);

  // 创建一些额外的用户来模拟班级
  const classUsers = [];
  const classNames = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"];
  
  for (let i = 0; i < 8; i++) {
    const user = await prisma.user.create({
      data: {
        name: `${classNames[i]}-2401班`,
        email: `student${i + 1}@example.com`,
        password: "$2b$10$SD1T/dYvKTArGdTmf8ERxuBKIONxY01/wSboRNaNsHnKZzDhps/0u",
        role: "GUEST",
      },
    });
    classUsers.push(user);
  }

  // 为班级用户创建提交记录
  for (const user of classUsers) {
    const userProblems = problems.slice(0, Math.floor(Math.random() * 3) + 1);
    
    for (const problem of userProblems) {
      const submission = await prisma.submission.create({
        data: {
          language: Math.random() > 0.5 ? EditorLanguage.c : EditorLanguage.cpp,
          code: `// ${user.name} 的代码\n#include <stdio.h>\nint main() { return 0; }`,
          status: Math.random() > 0.6 ? Status.AC : Status.WA, // 40% 的正确率
          message: "班级学生提交",
          executionTime: Math.floor(Math.random() * 1000) + 1,
          memoryUsage: Math.floor(Math.random() * 128) + 1,
          userId: user.id,
          problemId: problem.id,
        },
      });

      // 为提交创建测试用例结果
      const testcases = await prisma.testcase.findMany({
        where: { problemId: submission.problemId },
      });

      for (const testcase of testcases) {
        const isCorrect = submission.status === Status.AC;
        
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
      }
    }
  }

  console.log("Teacher Dashboard 测试数据创建完成！");
}

function getRandomStatus(): Status {
  const statuses = [
    Status.AC,   // Accepted
    Status.WA,   // Wrong Answer
    Status.CE,   // Compilation Error
    Status.TLE,  // Time Limit Exceeded
    Status.RE,   // Runtime Error
  ];
  
  // 让 AC 状态出现的概率更高一些
  const weights = [0.4, 0.3, 0.1, 0.1, 0.1];
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return statuses[i];
    }
  }
  
  return Status.WA;
}

// 运行函数
createDashboardTestData()
  .catch((e) => {
    console.error("创建测试数据时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 