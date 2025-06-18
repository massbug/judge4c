import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function checkSpecificUser() {
  console.log("检查用户 student@example.com 的数据情况...");

  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: "student@example.com" },
      select: { id: true, name: true, email: true, role: true }
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

    console.log("用户信息:", user);

    // 检查用户的提交记录
    const submissions = await prisma.submission.findMany({
      where: { userId: user.id },
      include: {
        problem: { select: { displayId: true, title: true } }
      }
    });

    console.log(`用户提交记录数: ${submissions.length}`);
    
    if (submissions.length > 0) {
      console.log("提交记录详情:");
      submissions.forEach((s, index) => {
        console.log(`${index + 1}. 题目${s.problem.displayId} (${s.problem.title}) - ${s.status}`);
      });
    } else {
      console.log("该用户没有提交记录");
    }

    // 检查所有已发布的题目
    const allProblems = await prisma.problem.findMany({
      where: { published: true },
      select: { id: true, displayId: true, title: true }
    });

    console.log(`\n已发布题目总数: ${allProblems.length}`);

  } catch (error) {
    console.error("检查用户时出错:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecificUser(); 