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
import {
  getStudentCourseDetail,
  listStudentAssignments,
} from "@/app/(protected)/dashboard/actions/assignment-stats";

export default function StudentCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Awaited<
    ReturnType<typeof getStudentCourseDetail>
  > | null>(null);
  const [assignments, setAssignments] = useState<Awaited<
    ReturnType<typeof listStudentAssignments>
  >>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, assignmentData] = await Promise.all([
          getStudentCourseDetail(courseId),
          listStudentAssignments(courseId),
        ]);
        setCourse(courseData);
        setAssignments(assignmentData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载课程失败");
      }
    };
    loadData();
  }, [courseId]);

  if (!course) {
    return <div className="p-6 text-sm text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>
            {course.description || "暂无课程简介"} · 教师：
            {course.teacher.name || course.teacher.email}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>作业列表</CardTitle>
          <CardDescription>点击进入作业查看测试点通过情况并开始做题</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无已发布作业</p>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    题目 {assignment._count.problems} 道
                    {assignment.dueAt
                      ? ` · 截止 ${new Date(assignment.dueAt).toLocaleString()}`
                      : " · 无截止时间"}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link
                    href={`/dashboard/student/courses/${courseId}/assignments/${assignment.id}`}
                  >
                    进入作业
                  </Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
