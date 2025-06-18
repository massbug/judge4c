import { PrismaClient, Status, EditorLanguage } from "@/generated/client";

const prisma = new PrismaClient();

async function addMoreProblems() {
  console.log("开始添加10个新题目...");
  
  // 获取一个管理员用户作为题目作者
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.error("未找到管理员用户，无法添加题目");
    return;
  }

  // 获取现有的最大displayId
  const maxProblem = await prisma.problem.findFirst({
    orderBy: { displayId: 'desc' }
  });
  const baseDisplayId = (maxProblem?.displayId || 1000) + 1;

  let createdProblems = [];

  for (let i = 0; i < 10; i++) {
    const displayId = baseDisplayId + i;
    const title = `新题目${displayId}`;
    const description = `这是新添加的第${i + 1}道题目，编号${displayId}`;
    const solution = `// 题目${displayId}的参考解答`;
    
    // 创建题目
    const problem = await prisma.problem.create({
      data: {
        displayId,
        title,
        description,
        solution,
        difficulty: "EASY",
        published: true,
        userId: admin.id,
        timeLimit: 1000,
        memoryLimit: 128,
      },
    });
    createdProblems.push(problem);
    console.log(`创建题目: ${displayId} - ${title}`);
    
    // 为题目生成2-3个测试用例
    const testcaseCount = Math.floor(Math.random() * 2) + 2;
    for (let j = 0; j < testcaseCount; j++) {
      await prisma.testcase.create({
        data: {
          problemId: problem.id,
          data: {
            create: [
              { label: `输入A`, value: `${j + 1}`, index: 0 },
              { label: `输入B`, value: `${(j + 1) * 2}`, index: 1 },
            ],
          },
          expectedOutput: `${(j + 1) + (j + 1) * 2}`,
        },
      });
    }
  }

  // 获取所有GUEST用户作为学生
  let students = await prisma.user.findMany({ where: { role: "GUEST" } });
  if (students.length === 0) {
    console.log("创建10个学生用户...");
    // 如果没有学生，自动创建10个
    const studentNames = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十", "郑十一", "王十二"];
    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          name: studentNames[i],
          email: `auto_student${i + 1}@example.com`,
          password: "$2b$10$SD1T/dYvKTArGdTmf8ERxuBKIONxY01/wSboRNaNsHnKZzDhps/0u",
          role: "GUEST",
        },
      });
      students.push(user);
    }
  }

  console.log(`为${createdProblems.length}个题目生成提交记录...`);

  // 为每个题目生成5-10个学生提交和测试用例结果
  for (const problem of createdProblems) {
    const testcases = await prisma.testcase.findMany({ where: { problemId: problem.id } });
    const studentCount = Math.floor(Math.random() * 6) + 5; // 5-10个学生
    
    for (let i = 0; i < studentCount; i++) {
      const student = students[i % students.length];
      // 随机生成1-2次提交
      const submissionTimes = Math.floor(Math.random() * 2) + 1;
      
      for (let t = 0; t < submissionTimes; t++) {
        // 60%概率AC，40%概率WA
        const isAC = Math.random() < 0.6;
        const submission = await prisma.submission.create({
          data: {
            language: Math.random() > 0.5 ? EditorLanguage.c : EditorLanguage.cpp,
            code: `// ${student.name} 针对题目${problem.displayId}的提交`,
            status: isAC ? Status.AC : Status.WA,
            message: "自动生成提交",
            executionTime: Math.floor(Math.random() * 1000) + 1,
            memoryUsage: Math.floor(Math.random() * 128) + 1,
            userId: student.id,
            problemId: problem.id,
          },
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
      }
    }
    console.log(`题目${problem.displayId}已生成${studentCount}个学生的提交记录`);
  }

  console.log("已成功添加10个新题目及其相关数据！");
}

addMoreProblems()
  .catch((e) => {
    console.error("添加题目时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 