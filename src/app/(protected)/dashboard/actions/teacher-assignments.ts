"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  assertCourseManagePermission,
  assertTeacherOrAdmin,
  getAuthenticatedActor,
} from "@/app/(protected)/dashboard/actions/course-auth";

interface AssignmentProblemInput {
  problemId: string;
  maxPoints: number;
  order?: number;
}

interface CreateAssignmentInput {
  courseId: string;
  title: string;
  description?: string;
  opensAt?: string;
  dueAt?: string;
  published?: boolean;
  problems: AssignmentProblemInput[];
}

interface UpdateAssignmentInput {
  title?: string;
  description?: string | null;
  opensAt?: string | null;
  dueAt?: string | null;
  published?: boolean;
  problems?: AssignmentProblemInput[];
}

function normalizePoints(points: number) {
  const normalized = Number(points);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    throw new Error("分值必须是正整数");
  }
  return Math.round(normalized);
}

async function validateProblems(problems: AssignmentProblemInput[]) {
  if (!Array.isArray(problems) || problems.length === 0) {
    throw new Error("作业至少需要一道题目");
  }

  const uniqueProblemIds = [...new Set(problems.map((item) => item.problemId))];
  const existingProblems = await prisma.problem.findMany({
    where: {
      id: { in: uniqueProblemIds },
      isPublished: true,
    },
    select: { id: true },
  });

  if (existingProblems.length !== uniqueProblemIds.length) {
    throw new Error("题目不存在或未发布");
  }
}

function parseDateValue(value?: string | null) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("日期格式不合法");
  }
  return date;
}

export async function createAssignment(input: CreateAssignmentInput) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(input.courseId, actor);
  await validateProblems(input.problems);

  const title = input.title.trim();
  if (!title) {
    throw new Error("作业标题不能为空");
  }

  const opensAt = parseDateValue(input.opensAt);
  const dueAt = parseDateValue(input.dueAt);

  if (opensAt && dueAt && opensAt >= dueAt) {
    throw new Error("截止时间必须晚于开始时间");
  }

  const assignment = await prisma.assignment.create({
    data: {
      courseId: input.courseId,
      title,
      description: input.description?.trim() || null,
      opensAt,
      dueAt,
      published: Boolean(input.published),
      createdById: actor.id,
      problems: {
        create: input.problems.map((item, index) => ({
          problemId: item.problemId,
          maxPoints: normalizePoints(item.maxPoints),
          order: item.order ?? index + 1,
        })),
      },
    },
    select: {
      id: true,
      courseId: true,
    },
  });

  revalidatePath(`/dashboard/teacher/courses/${assignment.courseId}`);
  revalidatePath(
    `/dashboard/teacher/courses/${assignment.courseId}/assignments/${assignment.id}`
  );
  revalidatePath("/dashboard/student/courses");

  return assignment;
}

export async function updateAssignment(
  assignmentId: string,
  input: UpdateAssignmentInput
) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { id: true, courseId: true },
  });

  if (!assignment) {
    throw new Error("作业不存在");
  }

  await assertCourseManagePermission(assignment.courseId, actor);

  const nextData: {
    title?: string;
    description?: string | null;
    opensAt?: Date | null;
    dueAt?: Date | null;
    published?: boolean;
  } = {};

  if (typeof input.title === "string") {
    const title = input.title.trim();
    if (!title) {
      throw new Error("作业标题不能为空");
    }
    nextData.title = title;
  }
  if (typeof input.description !== "undefined") {
    nextData.description = input.description?.trim() || null;
  }
  if (typeof input.opensAt !== "undefined") {
    nextData.opensAt = parseDateValue(input.opensAt);
  }
  if (typeof input.dueAt !== "undefined") {
    nextData.dueAt = parseDateValue(input.dueAt);
  }
  if (typeof input.published === "boolean") {
    nextData.published = input.published;
  }

  if (nextData.opensAt && nextData.dueAt && nextData.opensAt >= nextData.dueAt) {
    throw new Error("截止时间必须晚于开始时间");
  }

  await prisma.assignment.update({
    where: { id: assignmentId },
    data: nextData,
  });

  if (input.problems) {
    await validateProblems(input.problems);
    await prisma.assignmentProblem.deleteMany({
      where: { assignmentId },
    });
    await prisma.assignmentProblem.createMany({
      data: input.problems.map((item, index) => ({
        assignmentId,
        problemId: item.problemId,
        maxPoints: normalizePoints(item.maxPoints),
        order: item.order ?? index + 1,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath(`/dashboard/teacher/courses/${assignment.courseId}`);
  revalidatePath(
    `/dashboard/teacher/courses/${assignment.courseId}/assignments/${assignmentId}`
  );
  revalidatePath(
    `/dashboard/student/courses/${assignment.courseId}/assignments/${assignmentId}`
  );
}

export async function publishAssignment(
  assignmentId: string,
  published: boolean = true
) {
  return updateAssignment(assignmentId, { published });
}

export async function getAssignmentDetail(assignmentId: string) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      title: true,
      description: true,
      opensAt: true,
      dueAt: true,
      published: true,
      courseId: true,
      course: {
        select: {
          id: true,
          title: true,
          teacherId: true,
          teacher: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      problems: {
        orderBy: [{ order: "asc" }, { problem: { displayId: "asc" } }],
        select: {
          problemId: true,
          maxPoints: true,
          order: true,
          problem: {
            select: {
              displayId: true,
              difficulty: true,
              localizations: {
                where: { type: "TITLE", locale: "zh" },
                select: { content: true },
              },
            },
          },
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  if (!assignment) {
    throw new Error("作业不存在");
  }

  await assertCourseManagePermission(assignment.courseId, actor);
  return assignment;
}

export async function listCourseAssignments(courseId: string) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(courseId, actor);

  return prisma.assignment.findMany({
    where: { courseId },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      opensAt: true,
      dueAt: true,
      published: true,
      createdAt: true,
      _count: {
        select: {
          problems: true,
          submissions: true,
        },
      },
    },
  });
}

export async function listAssignableProblems() {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  return prisma.problem.findMany({
    where: { isPublished: true },
    orderBy: { displayId: "asc" },
    select: {
      id: true,
      displayId: true,
      difficulty: true,
      localizations: {
        where: { type: "TITLE", locale: "zh" },
        select: { content: true },
      },
    },
  });
}
