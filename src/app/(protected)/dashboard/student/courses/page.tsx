"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listStudentCourses } from "@/app/(protected)/dashboard/actions/teacher-courses";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Awaited<
    ReturnType<typeof listStudentCourses>
  >>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await listStudentCourses();
        setCourses(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载课程失败");
      }
    };
    loadCourses();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>我的课程</CardTitle>
          <CardDescription>进入课程查看作业、截止时间和成绩</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无已加入课程</p>
          ) : (
            courses.map((item) => (
              <div
                key={item.course.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{item.course.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.course.description || "暂无课程简介"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    教师：{item.course.teacher.name || item.course.teacher.email} ·
                    作业 {item.course._count.assignments} 个
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/dashboard/student/courses/${item.course.id}`}>
                    进入课程
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
