"use server";

import prisma from "@/lib/prisma";
import { Locale, Status, ProblemLocalization } from "@/generated/client";
import { getLocale } from "next-intl/server";

const getLocalizedTitle = (
  localizations: ProblemLocalization[],
  locale: Locale
) => {
  if (!localizations || localizations.length === 0) {
    return "Unknown Title";
  }

  const localization = localizations.find(
    (localization) => localization.locale === locale
  );

  return localization?.content ?? localizations[0].content ?? "Unknown Title";
};

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
      problem: {
        include:{
          localizations:true
        }
      }
    },
  });

  const locale = await getLocale();

  // 按题目分组统计完成情况（统计独立用户数）
  const problemStats = new Map<string, { 
    completedUsers: Set<string>; 
    totalUsers: Set<string>; 
    title: string;
    displayId: number;
  }>();

  submissions.forEach((submission) => {
    const localizations=submission.problem.localizations;
    const title=getLocalizedTitle(localizations,locale as Locale);
    const problemId = submission.problemId;
    const problemTitle = title;
    const problemDisplayId = submission.problem.displayId;
    const userId = submission.userId;
    const isCompleted = submission.status === Status.AC; // 只有 Accepted 才算完成

    if (!problemStats.has(problemId)) {
      problemStats.set(problemId, { 
        completedUsers: new Set(), 
        totalUsers: new Set(), 
        title: problemTitle,
        displayId: problemDisplayId,
      });
    }

    const stats = problemStats.get(problemId)!;
    stats.totalUsers.add(userId);
    if (isCompleted) {
      stats.completedUsers.add(userId);
    }
  });

  // 如果没有数据，返回空数组
  if (problemStats.size === 0) {
    return [];
  }

  // 转换为图表数据格式，按题目displayId排序
  const problemDataArray = Array.from(problemStats.entries()).map(([problemId, stats]) => {
    const completed = stats.completedUsers.size;
    const total = stats.totalUsers.size;
    
    return {
      problemId: problemId,
      problemDisplayId: stats.displayId,
      problemTitle: stats.title,
      completed: completed,
      uncompleted: total - completed,
      total: total,
      completedPercent: total > 0 ? (completed / total) * 100 : 0,
      uncompletedPercent: total > 0 ? ((total - completed) / total) * 100 : 0,
    };
  });

  // 按题目编号排序
  return problemDataArray.sort((a, b) => a.problemDisplayId - b.problemDisplayId);
}

export async function getDifficultProblemsData(): Promise<DifficultProblemData[]> {
  // 获取所有测试用例结果
  const testcaseResults = await prisma.testcaseResult.findMany({
    include: {
      testcase: {
        include: {
          problem: {
            include: {
              localizations: true
            }
          },
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
    const problemTitle = result.testcase.problem.localizations?.find(
        (loc) => loc.type === "TITLE"
    )?.content || "无标题";
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