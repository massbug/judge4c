import { Grid } from "@/components/ui/grid";
import StatCard from "./stat-card";
import { LspStatus } from "./lsp-status";
import { ProblemsetTable } from "@/features/problemset/components/table";
import { SubmissionTable } from "@/features/problems/submission/components/table";
import prisma from "@/lib/prisma";
import type { ReactNode } from "react";

interface AdminDashboardProps {
  userCount?: number;
  problemCount?: number;
}

export const AdminDashboard = async ({
  userCount = 0,
  problemCount = 0
}: AdminDashboardProps) => {
  // 获取统计数据显示
  const [usersCount, problemsCount, submissionsCount] = await Promise.all([
    prisma.user.count(),
    prisma.problem.count(),
    prisma.submission.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">仪表盘</h2>
        <p className="text-muted-foreground">
          系统运行状态概览
        </p>
      </div>

      <Grid cols={3} gap={6}>
        <StatCard title="用户数量" value={userCount || usersCount} />
        <StatCard title="问题数量" value={problemCount || problemsCount} />
        <StatCard title="测评次数" value={submissionsCount} />
      </Grid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LspStatus />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">最近提交记录</h3>
          {/* 临时使用空字符串作为占位符，实际应从数据库获取最新问题ID */}
          <SubmissionTable problemId="" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">问题列表</h3>
        <ProblemsetTable />
      </div>
    </div>
  );
};