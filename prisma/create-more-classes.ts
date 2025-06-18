import { PrismaClient, Status, EditorLanguage } from "@/generated/client";

const prisma = new PrismaClient();

async function createMoreClasses() {
  console.log("开始创建更多班级的测试数据...");

  // 获取现有的题目
  const problems = await prisma.problem.findMany();
  
  if (problems.length === 0) {
    console.log("没有找到题目，请先运行主种子文件");
    return;
  }

  // 创建10个班级的用户
  const classNumbers = ["2401", "2402", "2403", "2404", "2405", "2406", "2407", "2408", "2409", "2410"];
  const classNames = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十", "郑十一", "王十二"];
  
  for (let i = 0; i < 10; i++) {
    // 为每个班级创建3-5个学生
    const studentsPerClass = Math.floor(Math.random() * 3) + 3; // 3-5个学生
    
    for (let j = 0; j < studentsPerClass; j++) {
      const studentName = `${classNames[i]}-${j + 1}`;
      
      // 创建学生用户
      const user = await prisma.user.create({
        data: {
          name: `${studentName}-${classNumbers[i]}班`,
          email: `student_${classNumbers[i]}_${j + 1}@example.com`,
          password: "$2b$10$SD1T/dYvKTArGdTmf8ERxuBKIONxY01/wSboRNaNsHnKZzDhps/0u",
          role: "GUEST",
        },
      });

      // 为每个学生创建2-4个题目的提交记录
      const userProblems = problems.slice(0, Math.floor(Math.random() * 3) + 2);
      
      for (const problem of userProblems) {
        // 创建1-3次提交记录
        const submissionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let k = 0; k < submissionCount; k++) {
          // 根据班级设置不同的完成率
          let completionRate;
          if (i < 3) {
            completionRate = 0.8; // 前3个班级完成率80%
          } else if (i < 6) {
            completionRate = 0.6; // 中间3个班级完成率60%
          } else {
            completionRate = 0.4; // 后4个班级完成率40%
          }

          const submission = await prisma.submission.create({
            data: {
              language: Math.random() > 0.5 ? EditorLanguage.c : EditorLanguage.cpp,
              code: `// ${studentName} 的代码\n#include <stdio.h>\nint main() { return 0; }`,
              status: Math.random() < completionRate ? Status.AC : getRandomErrorStatus(),
              message: `${classNumbers[i]}班学生提交`,
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
    }
  }

  console.log("10个班级的测试数据创建完成！");
}

function getRandomErrorStatus(): Status {
  const errorStatuses = [
    Status.WA,   // Wrong Answer
    Status.CE,   // Compilation Error
    Status.TLE,  // Time Limit Exceeded
    Status.RE,   // Runtime Error
  ];
  
  const weights = [0.4, 0.2, 0.2, 0.2];
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < errorStatuses.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return errorStatuses[i];
    }
  }
  
  return Status.WA;
}

// 运行函数
createMoreClasses()
  .catch((e) => {
    console.error("创建班级数据时出错:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 