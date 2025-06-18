import { PrismaClient, Status, EditorLanguage } from "@/generated/client";

const prisma = new PrismaClient();

async function generateUserData() {
  console.log("为 student@example.com 生成测试数据...");

  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: "student@example.com" }
    });

    if (!user) {
      console.log("用户不存在，创建用户...");
      const newUser = await prisma.user.create({
        data: {
          name: "测试学生",
          email: "student@example.com",
          password: "$2b$10$SD1T/dYvKTArGdTmf8ERxuBKIONxY01/wSboRNaNsHnKZzDhps/0u",
          role: "GUEST",
        },
      });
      console.log("创建用户成功:", newUser);
      return;
    }

    console.log("找到用户:", user.name || user.email);

    // 获取所有已发布的题目
    const problems = await prisma.problem.findMany({
      where: { published: true },
      select: { id: true, displayId: true, title: true }
    });

    console.log(`找到 ${problems.length} 道已发布题目`);

    // 为这个用户生成提交记录
    const submissionCount = Math.min(problems.length, 8); // 最多8道题目
    const selectedProblems = problems.slice(0, submissionCount);

    for (const problem of selectedProblems) {
      // 为每道题目生成1-3次提交
      const attempts = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < attempts; i++) {
        // 60%概率AC，40%概率WA
        const isAC = Math.random() < 0.6 || i === attempts - 1; // 最后一次提交更可能是AC
        
        const submission = await prisma.submission.create({
          data: {
            language: Math.random() > 0.5 ? EditorLanguage.c : EditorLanguage.cpp,
            code: `// ${user.name || user.email} 针对题目${problem.displayId}的第${i + 1}次提交`,
            status: isAC ? Status.AC : Status.WA,
            message: isAC ? "Accepted" : "Wrong Answer",
            executionTime: Math.floor(Math.random() * 1000) + 1,
            memoryUsage: Math.floor(Math.random() * 128) + 1,
            userId: user.id,
            problemId: problem.id,
          },
        });

        // 获取题目的测试用例
        const testcases = await prisma.testcase.findMany({
          where: { problemId: problem.id }
        });

        // 为每个提交生成测试用例结果
        for (const testcase of testcases) {
          await prisma.testcaseResult.create({
            data: {
              isCorrect: isAC,
              output: isAC ? "正确答案" : "错误答案",
              executionTime: Math.floor(Math.random() * 1000) + 1,
              memoryUsage: Math.floor(Math.random() * 128) + 1,
              submissionId: submission.id,
              testcaseId: testcase.id,
            },
          });
        }

        console.log(`题目${problem.displayId}: 第${i + 1}次提交 - ${isAC ? 'AC' : 'WA'}`);
        
        // 如果AC了，就不再继续提交这道题
        if (isAC) break;
      }
    }

    console.log("数据生成完成！");

    // 验证生成的数据
    const userSubmissions = await prisma.submission.findMany({
      where: { userId: user.id },
      include: {
        problem: { select: { displayId: true, title: true } }
      }
    });

    console.log(`\n用户 ${user.name || user.email} 现在有 ${userSubmissions.length} 条提交记录:`);
    userSubmissions.forEach((s, index) => {
      console.log(`${index + 1}. 题目${s.problem.displayId} (${s.problem.title}) - ${s.status}`);
    });

  } catch (error) {
    console.error("生成数据时出错:", error);
  } finally {
    await prisma.$disconnect();
  }
}

generateUserData(); 