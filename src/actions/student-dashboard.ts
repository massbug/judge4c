"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getStudentDashboardData() {
  try {
    console.log("=== 开始获取学生仪表板数据 ===");
    
    const session = await auth();
    console.log("Session 获取成功:", !!session);
    console.log("Session user:", session?.user);
    
    if (!session?.user?.id) {
      console.log("用户未登录或session无效");
      throw new Error("未登录");
    }

    const userId = session.user.id;
    console.log("当前用户ID:", userId);

    // 检查用户是否存在
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });
    console.log("当前用户信息:", currentUser);

    if (!currentUser) {
      throw new Error("用户不存在");
    }

    // 获取所有已发布的题目
    const allProblems = await prisma.problem.findMany({
      where: { published: true },
      select: { id: true, displayId: true, title: true, difficulty: true }
    });
    console.log("已发布题目数量:", allProblems.length);

    // 获取当前学生的所有提交记录
    const userSubmissions = await prisma.submission.findMany({
      where: { userId: userId },
      include: {
        problem: {
          select: { id: true, displayId: true, title: true, difficulty: true }
        }
      }
    });
    console.log("当前用户提交记录数量:", userSubmissions.length);
    console.log("提交记录详情:", userSubmissions.map(s => ({
      problemId: s.problemId,
      problemDisplayId: s.problem.displayId,
      status: s.status
    })));

    // 计算题目完成情况
    const completedProblems = new Set<string | number>();
    const attemptedProblems = new Set<string | number>();
    const wrongSubmissions = new Map<string | number, number>(); // problemId -> count

    userSubmissions.forEach((submission: any) => {
      attemptedProblems.add(submission.problemId);
      
      if (submission.status === "AC") {
        completedProblems.add(submission.problemId);
      } else {
        // 统计错误提交次数
        const currentCount = wrongSubmissions.get(submission.problemId) || 0;
        wrongSubmissions.set(submission.problemId, currentCount + 1);
      }
    });

    console.log("尝试过的题目数:", attemptedProblems.size);
    console.log("完成的题目数:", completedProblems.size);
    console.log("错误提交统计:", Object.fromEntries(wrongSubmissions));

    // 题目完成比例数据
    const completionData = {
      total: allProblems.length,
      completed: completedProblems.size,
      percentage: allProblems.length > 0 ? Math.round((completedProblems.size / allProblems.length) * 100) : 0,
    };

    // 错题比例数据 - 基于已完成的题目计算
    const completedProblemsArray = Array.from(completedProblems);
    const wrongProblems = new Set<string | number>();
    
    // 统计在已完成的题目中，哪些题目曾经有过错误提交
    userSubmissions.forEach((submission: any) => {
      if (submission.status !== "AC" && completedProblems.has(submission.problemId)) {
        wrongProblems.add(submission.problemId);
      }
    });
    
    const errorData = {
      total: completedProblems.size, // 已完成的题目总数
      wrong: wrongProblems.size, // 在已完成的题目中有过错误的题目数
      percentage: completedProblems.size > 0 ? Math.round((wrongProblems.size / completedProblems.size) * 100) : 0,
    };

    // 易错题列表（按错误次数排序）
    const difficultProblems = Array.from(wrongSubmissions.entries())
      .map(([problemId, errorCount]) => {
        const problem = allProblems.find((p: any) => p.id === problemId);
        return {
          id: problem?.displayId || problemId,
          title: problem?.title || "未知题目",
          difficulty: problem?.difficulty || "未知",
          errorCount: errorCount as number,
        };
      })
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 10); // 只显示前10个

    const result = {
      completionData,
      errorData,
      difficultProblems,
      pieChartData: [
        { name: "已完成", value: completionData.completed },
        { name: "未完成", value: completionData.total - completionData.completed },
      ],
      errorPieChartData: [
        { name: "正确", value: errorData.total - errorData.wrong },
        { name: "错误", value: errorData.wrong },
      ],
    };

    console.log("=== 返回的数据 ===");
    console.log("完成情况:", completionData);
    console.log("错误情况:", errorData);
    console.log("易错题数量:", difficultProblems.length);
    console.log("=== 数据获取完成 ===");

    return result;
  } catch (error) {
    console.error("获取学生仪表板数据失败:", error);
    throw new Error(`获取数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
} 