"use server";

import prisma from "@/lib/prisma";
import { Status } from "@/generated/client";

export interface ProblemCompletionData {
  problemId: string;
  problemDisplayId: number;
  problemTitle: string;
  completed: number;
  uncompleted: number;
  total: number;
  completedPercent: number;
  uncompletedPercent: number;
}

export interface DifficultProblemData {
  id: string;
  className: string;
  problemCount: number;
  problemTitle: string;
  problemDisplayId: number;
}

export async function getProblemCompletionData(): Promise<ProblemCompletionData[]> {
  // 获取所有提交记录，按题目分组统计
  const submissions = await prisma.submission.findMany({
    include: {
      user: true,
      problem: true,
    },
  });

  // 按题目分组统计完成情况
  const problemStats = new Map<string, { 
    completed: number; 
    total: number; 
    title: string;
    displayId: number;
  }>();

  submissions.forEach((submission) => {
    const problemId = submission.problemId;
    const problemTitle = submission.problem.title;
    const problemDisplayId = submission.problem.displayId;
    const isCompleted = submission.status === Status.AC; // 只有 Accepted 才算完成

    if (!problemStats.has(problemId)) {
      problemStats.set(problemId, { 
        completed: 0, 
        total: 0, 
        title: problemTitle,
        displayId: problemDisplayId,
      });
    }

    const stats = problemStats.get(problemId)!;
    stats.total++;
    if (isCompleted) {
      stats.completed++;
    }
  });

  // 如果没有数据，返回空数组
  if (problemStats.size === 0) {
    return [];
  }

  // 转换为图表数据格式，按题目displayId排序
  const problemDataArray = Array.from(problemStats.entries()).map(([problemId, stats]) => ({
    problemId: problemId,
    problemDisplayId: stats.displayId,
    problemTitle: stats.title,
    completed: stats.completed,
    uncompleted: stats.total - stats.completed,
    total: stats.total,
    completedPercent: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    uncompletedPercent: stats.total > 0 ? ((stats.total - stats.completed) / stats.total) * 100 : 0,
  }));

  // 按题目编号排序
  return problemDataArray.sort((a, b) => a.problemDisplayId - b.problemDisplayId);
}

export async function getDifficultProblemsData(): Promise<DifficultProblemData[]> {
  // 获取所有测试用例结果
  const testcaseResults = await prisma.testcaseResult.findMany({
    include: {
      testcase: {
        include: {
          problem: true,
        },
      },
      submission: {
        include: {
          user: true,
        },
      },
    },
  });

  // 按问题分组统计错误率
  const problemStats = new Map<string, { 
    totalAttempts: number; 
    wrongAttempts: number; 
    title: string;
    displayId: number;
    users: Set<string>;
  }>();

  testcaseResults.forEach((result) => {
    const problemId = result.testcase.problemId;
    const problemTitle = result.testcase.problem.title;
    const problemDisplayId = result.testcase.problem.displayId;
    const userId = result.submission.userId;
    const isWrong = !result.isCorrect;

    if (!problemStats.has(problemId)) {
      problemStats.set(problemId, {
        totalAttempts: 0,
        wrongAttempts: 0,
        title: problemTitle,
        displayId: problemDisplayId,
        users: new Set(),
      });
    }

    const stats = problemStats.get(problemId)!;
    stats.totalAttempts++;
    stats.users.add(userId);
    if (isWrong) {
      stats.wrongAttempts++;
    }
  });

  // 计算错误率并筛选易错题（错误率 > 30% 且至少有3次尝试）
  const difficultProblems = Array.from(problemStats.entries())
    .map(([problemId, stats]) => ({
      id: problemId,
      className: `题目 ${stats.title}`,
      problemCount: stats.wrongAttempts,
      problemTitle: stats.title,
      problemDisplayId: stats.displayId,
      errorRate: (stats.wrongAttempts / stats.totalAttempts) * 100,
      uniqueUsers: stats.users.size,
      totalAttempts: stats.totalAttempts,
    }))
    .filter((problem) => 
      problem.errorRate > 30 && // 错误率超过30%
      problem.totalAttempts >= 3 // 至少有3次尝试
    )
    .sort((a, b) => b.errorRate - a.errorRate) // 按错误率降序排列
    .slice(0, 10); // 取前10个最难的题目

  return difficultProblems;
}

export async function getDashboardStats() {
  const [problemData, difficultProblems] = await Promise.all([
    getProblemCompletionData(),
    getDifficultProblemsData(),
  ]);

  return {
    problemData,
    difficultProblems,
    totalProblems: problemData.length,
    totalDifficultProblems: difficultProblems.length,
  };
} 