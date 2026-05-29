"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  enrollStudents,
  getCourseStudents,
  getTeacherCourseDetail,
  listAvailableStudents,
} from "@/app/(protected)/dashboard/actions/teacher-courses";
import {
  createAssignment,
  listAssignableProblems,
  listCourseAssignments,
} from "@/app/(protected)/dashboard/actions/teacher-assignments";

interface SelectableStudent {
  id: string;
  name: string | null;
  email: string;
}

interface SelectableProblem {
  id: string;
  displayId: number;
  difficulty: string;
  localizations: { content: string }[];
}

export default function TeacherCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [course, setCourse] = useState<Awaited<
    ReturnType<typeof getTeacherCourseDetail>
  > | null>(null);
  const [students, setStudents] = useState<Awaited<ReturnType<typeof getCourseStudents>>>([]);
  const [availableStudents, setAvailableStudents] = useState<SelectableStudent[]>([]);
  const [assignments, setAssignments] = useState<Awaited<
    ReturnType<typeof listCourseAssignments>
  >>([]);
  const [problems, setProblems] = useState<SelectableProblem[]>([]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueAt, setAssignmentDueAt] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  const selectedProblemIds = useMemo(
    () => selectedProblems,
    [selectedProblems]
  );

  const loadData = useCallback(async () => {
    try {
      const [courseData, studentsData, allStudents, assignmentData, problemData] =
        await Promise.all([
          getTeacherCourseDetail(courseId),
          getCourseStudents(courseId),
          listAvailableStudents(),
          listCourseAssignments(courseId),
          listAssignableProblems(),
        ]);
      setCourse(courseData);
      setStudents(studentsData);
      setAvailableStudents(allStudents);
      setAssignments(assignmentData);
      setProblems(problemData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载课程数据失败");
    }
  }, [courseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnrollStudents = () => {
    if (selectedStudents.length === 0) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await enrollStudents(courseId, selectedStudents);
        setSelectedStudents([]);
        await loadData();
      } catch (e) {
        setError(e instanceof Error ? e.message : "添加学生失败");
      }
    });
  };

  const handleCreateAssignment = () => {
    if (!assignmentTitle.trim() || selectedProblemIds.length === 0) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await createAssignment({
          courseId,
          title: assignmentTitle,
          description: assignmentDescription,
          dueAt: assignmentDueAt || undefined,
          published: true,
          problems: selectedProblemIds.map((problemId, index) => ({
            problemId,
            order: index + 1,
          })),
        });
        setAssignmentTitle("");
        setAssignmentDescription("");
        setAssignmentDueAt("");
        setSelectedProblems([]);
        await loadData();
      } catch (e) {
        setError(e instanceof Error ? e.message : "创建作业失败");
      }
    });
  };

  const toggleStudent = (studentId: string, checked: boolean) => {
    setSelectedStudents((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  const toggleProblem = (problemId: string, checked: boolean) => {
    setSelectedProblems((prev) => {
      if (!checked) {
        return prev.filter((id) => id !== problemId);
      }
      return prev.includes(problemId) ? prev : [...prev, problemId];
    });
  };

  if (!course) {
    return <div className="p-6 text-sm text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>
            {course.description || "暂无课程简介"} · 学生 {course._count.enrollments} 人 ·
            作业 {course._count.assignments} 个
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>学生管理</CardTitle>
          <CardDescription>勾选学生后加入课程</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            {availableStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-2 rounded-md border p-2 text-sm"
              >
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onCheckedChange={(checked) =>
                    toggleStudent(student.id, checked === true)
                  }
                />
                <span>
                  {student.name || "未命名"} ({student.email})
                </span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleEnrollStudents}
            disabled={isPending || selectedStudents.length === 0}
          >
            {isPending ? "处理中..." : "加入课程"}
          </Button>

          <div className="rounded-md border p-3">
            <p className="mb-2 text-sm font-medium">已加入学生</p>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无学生</p>
            ) : (
              students.map((item) => (
                <p key={item.user.id} className="text-sm">
                  {item.user.name || "未命名"} ({item.user.email})
                </p>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>创建作业</CardTitle>
          <CardDescription>选择题目后发布给课程学生练习</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="作业标题"
          />
          <Textarea
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
            placeholder="作业说明（可选）"
          />
          <Input
            type="datetime-local"
            value={assignmentDueAt}
            onChange={(e) => setAssignmentDueAt(e.target.value)}
          />
          <div className="space-y-2 rounded-md border p-3">
            {problems.map((problem) => {
              const selected = selectedProblemIds.includes(problem.id);
              return (
                <label
                  key={problem.id}
                  className="flex items-center gap-2 rounded border p-2 text-sm"
                >
                  <Checkbox
                    checked={selected}
                    onCheckedChange={(checked) =>
                      toggleProblem(problem.id, checked === true)
                    }
                  />
                  <span>
                    #{problem.displayId}{" "}
                    {problem.localizations[0]?.content || "未命名题目"} (
                    {problem.difficulty})
                  </span>
                </label>
              );
            })}
          </div>
          <Button
            onClick={handleCreateAssignment}
            disabled={isPending || !assignmentTitle.trim() || selectedProblemIds.length === 0}
          >
            {isPending ? "创建中..." : "发布作业"}
          </Button>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>作业列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无作业</p>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    题目 {assignment._count.problems} 道 · 提交{" "}
                    {assignment._count.submissions} 次
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link
                    href={`/dashboard/teacher/courses/${courseId}/assignments/${assignment.id}`}
                  >
                    查看统计
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
