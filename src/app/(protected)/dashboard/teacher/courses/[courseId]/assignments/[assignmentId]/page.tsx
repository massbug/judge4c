"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAssignmentDetail,
  updateAssignment,
} from "@/app/(protected)/dashboard/actions/teacher-assignments";
import { getTeacherAssignmentStats } from "@/app/(protected)/dashboard/actions/assignment-stats";

export default function TeacherAssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [detail, setDetail] = useState<Awaited<
    ReturnType<typeof getAssignmentDetail>
  > | null>(null);
  const [stats, setStats] = useState<Awaited<
    ReturnType<typeof getTeacherAssignmentStats>
  > | null>(null);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [assignmentDetail, assignmentStats] = await Promise.all([
        getAssignmentDetail(assignmentId),
        getTeacherAssignmentStats(assignmentId),
      ]);
      setDetail(assignmentDetail);
      setStats(assignmentStats);
      setTitle(assignmentDetail.title);
      setDueAt(
        assignmentDetail.dueAt
          ? new Date(assignmentDetail.dueAt).toISOString().slice(0, 16)
          : ""
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载作业失败");
    }
  }, [assignmentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateAssignment(assignmentId, {
          title,
          dueAt: dueAt || null,
        });
        await loadData();
      } catch (e) {
        setError(e instanceof Error ? e.message : "更新作业失败");
      }
    });
  };

  const handleTogglePublish = () => {
    if (!detail) return;
    startTransition(async () => {
      try {
        await updateAssignment(assignmentId, {
          published: !detail.published,
        });
        await loadData();
      } catch (e) {
        setError(e instanceof Error ? e.message : "更新发布状态失败");
      }
    });
  };

  if (!detail || !stats) {
    return <div className="p-6 text-sm text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>作业设置</CardTitle>
          <CardDescription>
            课程：{detail.course.title} · 当前状态：
            {detail.published ? "已发布" : "未发布"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isPending || !title.trim()}>
              {isPending ? "保存中..." : "保存设置"}
            </Button>
            <Button onClick={handleTogglePublish} variant="outline" disabled={isPending}>
              {detail.published ? "设为未发布" : "发布作业"}
            </Button>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>班级成绩概览</CardTitle>
          <CardDescription>
            满分 {stats.maxScore} 分 · 共 {stats.problemCount} 题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.students.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无选课学生</p>
          ) : (
            stats.students.map((student) => (
              <div key={student.userId} className="rounded border p-3">
                <p className="font-medium">
                  {student.name || "未命名"} ({student.email})
                </p>
                <p className="text-sm text-muted-foreground">
                  总分 {student.totalScore}/{student.maxScore} · 完成率{" "}
                  {student.completionPercent}%
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>每题 AC 覆盖率</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.perProblemCoverage.map((item) => (
            <div key={item.problemId} className="rounded border p-3">
              <p className="font-medium">
                #{item.displayId} {item.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.solvedUsers}/{item.totalUsers} 人通过 · 覆盖率 {item.acCoverage}%
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
