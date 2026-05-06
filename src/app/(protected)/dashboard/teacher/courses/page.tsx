"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createCourse,
  listTeacherCourses,
} from "@/app/(protected)/dashboard/actions/teacher-courses";

interface CourseItem {
  id: string;
  title: string;
  description: string | null;
  archived: boolean;
  _count: {
    enrollments: number;
    assignments: number;
  };
}

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchCourses = async () => {
    try {
      const data = await listTeacherCourses();
      setCourses(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          archived: item.archived,
          _count: item._count,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载课程失败");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    setError(null);
    startTransition(async () => {
      try {
        await createCourse({ title, description });
        setTitle("");
        setDescription("");
        await fetchCourses();
      } catch (e) {
        setError(e instanceof Error ? e.message : "创建课程失败");
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>创建课程</CardTitle>
          <CardDescription>创建课程后可添加学生并发布作业</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="课程标题"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="课程简介（可选）"
          />
          <Button
            onClick={handleCreateCourse}
            disabled={isPending || !title.trim()}
          >
            {isPending ? "创建中..." : "创建课程"}
          </Button>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>我的课程</CardTitle>
          <CardDescription>点击课程进入作业编排与学生管理</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无课程</p>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.description || "暂无课程简介"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    学生 {course._count.enrollments} 人 · 作业{" "}
                    {course._count.assignments} 个
                    {course.archived ? " · 已归档" : ""}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/dashboard/teacher/courses/${course.id}`}>
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
