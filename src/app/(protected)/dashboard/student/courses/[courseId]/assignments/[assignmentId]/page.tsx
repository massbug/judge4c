"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStudentAssignmentSummary } from "@/app/(protected)/dashboard/actions/assignment-stats";

export default function StudentAssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof getStudentAssignmentSummary>
  > | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStudentAssignmentSummary(assignmentId);
        setSummary(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载作业失败");
      }
    };
    loadData();
  }, [assignmentId]);

  if (!summary) {
    return <div className="p-6 text-sm text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{summary.assignment.title}</CardTitle>
          <CardDescription>
            {summary.assignment.description || "暂无作业说明"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            通过测试点：{summary.passedTestcaseCount}/{summary.totalTestcases}
          </p>
          <p className="text-sm">
            通过题目：{summary.solvedCount}/{summary.problemCount}
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.assignment.dueAt
              ? `截止 ${new Date(summary.assignment.dueAt).toLocaleString()}`
              : "暂无截止时间"}
          </p>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>题目列表</CardTitle>
          <CardDescription>进入题目后会自动按本作业统计提交与测试点</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {summary.rows.map((row) => (
            <div
              key={row.problemId}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">
                  #{row.displayId} {row.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {row.testcaseCount > 0
                    ? `通过测试点 ${row.passedTestcaseCount}/${row.testcaseCount}`
                    : "未配置测试点"}{" "}
                  · 状态 {row.bestStatus} · 提交 {row.attempts} 次
                </p>
              </div>
              <Button asChild variant={row.solved ? "secondary" : "outline"}>
                <Link href={`/problems/${row.problemId}?assignmentId=${assignmentId}`}>
                  {row.solved ? "继续练习" : "开始做题"}
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
