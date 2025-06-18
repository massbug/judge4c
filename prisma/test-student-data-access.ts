import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function testStudentDataAccess() {
  console.log("测试学生数据访问...");

  try {
    // 1. 检查是否有学生用户
    const students = await prisma.user.findMany({
      where: { role: "GUEST" },
      select: { id: true, name: true, email: true }
    });
    console.log(`找到 ${students.length} 个学生用户:`);
    students.forEach(s => console.log(`  - ${s.name} (${s.email})`));

    if (students.length === 0) {
      console.log("没有学生用户，创建测试学生...");
      const testStudent = await prisma.user.create({
        data: {
          name: "测试学生",
          email: "test_student@example.com",
          password: "$2b$10$SD1T/dYvKTArGdTmf8ERxuBKIONxY01/wSboRNaNsHnKZzDhps/0u",
          role: "GUEST",
        },
      });
      console.log(`创建学生: ${testStudent.name}`);
    }

    // 2. 检查已发布的题目
    const publishedProblems = await prisma.problem.findMany({
      where: { published: true },
      select: { id: true, displayId: true, title: true }
    });
    console.log(`\n已发布题目数量: ${publishedProblems.length}`);
    publishedProblems.slice(0, 5).forEach(p => {
      console.log(`  - ${p.displayId}: ${p.title}`);
    });

    // 3. 检查提交记录
    const allSubmissions = await prisma.submission.findMany({
      select: { id: true, userId: true, problemId: true, status: true }
    });
    console.log(`\n总提交记录数: ${allSubmissions.length}`);

    // 4. 检查特定学生的提交记录
    const firstStudent = students[0] || await prisma.user.findFirst({ where: { role: "GUEST" } });
    if (firstStudent) {
      const studentSubmissions = await prisma.submission.findMany({
        where: { userId: firstStudent.id },
        include: {
          problem: { select: { displayId: true, title: true } }
        }
      });
      console.log(`\n学生 ${firstStudent.name} 的提交记录数: ${studentSubmissions.length}`);
      studentSubmissions.slice(0, 3).forEach(s => {
        console.log(`  - 题目${s.problem.displayId}: ${s.status}`);
      });
    }

    console.log("\n数据访问测试完成！");
  } catch (error) {
    console.error("测试过程中出错:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testStudentDataAccess(); 