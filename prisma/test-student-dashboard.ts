import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function testStudentDashboard() {
  console.log("测试学生仪表板数据获取...");

  // 获取一个学生用户
  const student = await prisma.user.findFirst({ 
    where: { role: "GUEST" },
    select: { id: true, name: true, email: true }
  });

  if (!student) {
    console.log("未找到学生用户，创建测试学生...");
    const newStudent = await prisma.user.create({
      data: {
        name: "测试学生",
        email: "test_student@example.com",
        password: "$2b$10$SD1T/dYvKTArGdTmf8ERxuBKIONxY01/wSboRNaNsHnKZzDhps/0u",
        role: "GUEST",
      },
    });
    console.log(`创建学生: ${newStudent.name} (${newStudent.email})`);
  }

  // 获取所有已发布的题目
  const allProblems = await prisma.problem.findMany({
    where: { published: true },
    select: { id: true, displayId: true, title: true, difficulty: true }
  });

  console.log(`总题目数: ${allProblems.length}`);

  // 获取学生的所有提交记录
  const userSubmissions = await prisma.submission.findMany({
    where: { userId: student?.id },
    include: {
      problem: {
        select: { id: true, displayId: true, title: true, difficulty: true }
      }
    }
  });

  console.log(`学生提交记录数: ${userSubmissions.length}`);

  // 计算题目完成情况
  const completedProblems = new Set();
  const attemptedProblems = new Set();
  const wrongSubmissions = new Map(); // problemId -> count

  userSubmissions.forEach(submission => {
    attemptedProblems.add(submission.problemId);
    
    if (submission.status === "AC") {
      completedProblems.add(submission.problemId);
    } else {
      // 统计错误提交次数
      const currentCount = wrongSubmissions.get(submission.problemId) || 0;
      wrongSubmissions.set(submission.problemId, currentCount + 1);
    }
  });

  // 题目完成比例数据
  const completionData = {
    total: allProblems.length,
    completed: completedProblems.size,
    percentage: allProblems.length > 0 ? Math.round((completedProblems.size / allProblems.length) * 100) : 0,
  };

  // 错题比例数据
  const totalSubmissions = userSubmissions.length;
  const wrongSubmissionsCount = userSubmissions.filter(s => s.status !== "AC").length;
  const errorData = {
    total: totalSubmissions,
    wrong: wrongSubmissionsCount,
    percentage: totalSubmissions > 0 ? Math.round((wrongSubmissionsCount / totalSubmissions) * 100) : 0,
  };

  // 易错题列表（按错误次数排序）
  const difficultProblems = Array.from(wrongSubmissions.entries())
    .map(([problemId, errorCount]) => {
      const problem = allProblems.find(p => p.id === problemId);
      return {
        id: problem?.displayId || problemId,
        title: problem?.title || "未知题目",
        difficulty: problem?.difficulty || "未知",
        errorCount: errorCount as number,
      };
    })
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10); // 只显示前10个

  console.log("\n=== 学生仪表板数据 ===");
  console.log(`题目完成情况: ${completionData.completed}/${completionData.total} (${completionData.percentage}%)`);
  console.log(`提交正确率: ${errorData.total - errorData.wrong}/${errorData.total} (${100 - errorData.percentage}%)`);
  console.log(`易错题数量: ${difficultProblems.length}`);

  if (difficultProblems.length > 0) {
    console.log("\n易错题列表:");
    difficultProblems.forEach((problem, index) => {
      console.log(`${index + 1}. 题目${problem.id} (${problem.title}) - ${problem.difficulty} - 错误${problem.errorCount}次`);
    });
  }

  console.log("\n测试完成！");
}

testStudentDashboard()
  .catch((e) => {
    console.error("测试学生仪表板时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 