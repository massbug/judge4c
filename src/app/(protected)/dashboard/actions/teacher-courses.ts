"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  assertCourseManagePermission,
  assertStudent,
  assertTeacherOrAdmin,
  getAuthenticatedActor,
} from "@/app/(protected)/dashboard/actions/course-auth";

interface CreateCourseInput {
  title: string;
  description?: string;
  teacherId?: string;
}

interface UpdateCourseInput {
  title?: string;
  description?: string | null;
  archived?: boolean;
}

export async function listTeacherCourses() {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  return prisma.course.findMany({
    where: actor.role === "ADMIN" ? undefined : { teacherId: actor.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          assignments: true,
        },
      },
    },
  });
}

export async function createCourse(input: CreateCourseInput) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  const title = input.title.trim();
  if (!title) {
    throw new Error("课程标题不能为空");
  }

  let teacherId = actor.id;
  if (actor.role === "ADMIN" && input.teacherId) {
    const teacher = await prisma.user.findUnique({
      where: { id: input.teacherId },
      select: { id: true, role: true },
    });
    if (!teacher || teacher.role !== "TEACHER") {
      throw new Error("指定教师不存在");
    }
    teacherId = teacher.id;
  }

  const course = await prisma.course.create({
    data: {
      title,
      description: input.description?.trim() || null,
      teacherId,
    },
    select: { id: true },
  });

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath("/dashboard/student/courses");
  return course;
}

export async function updateCourse(courseId: string, input: UpdateCourseInput) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(courseId, actor);

  const nextData: UpdateCourseInput = {};
  if (typeof input.title === "string") {
    const title = input.title.trim();
    if (!title) {
      throw new Error("课程标题不能为空");
    }
    nextData.title = title;
  }
  if (typeof input.description !== "undefined") {
    nextData.description = input.description?.trim() || null;
  }
  if (typeof input.archived === "boolean") {
    nextData.archived = input.archived;
  }

  await prisma.course.update({
    where: { id: courseId },
    data: nextData,
  });

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath(`/dashboard/teacher/courses/${courseId}`);
  revalidatePath("/dashboard/student/courses");
}

export async function enrollStudents(courseId: string, studentIds: string[]) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(courseId, actor);

  const uniqueStudentIds = [...new Set(studentIds.filter(Boolean))];
  if (uniqueStudentIds.length === 0) {
    return { enrolled: 0 };
  }

  const students = await prisma.user.findMany({
    where: {
      id: { in: uniqueStudentIds },
      role: "GUEST",
    },
    select: { id: true },
  });

  if (students.length === 0) {
    throw new Error("未找到可加入课程的学生");
  }

  await prisma.courseEnrollment.createMany({
    data: students.map((student) => ({
      courseId,
      userId: student.id,
      role: "STUDENT",
    })),
    skipDuplicates: true,
  });

  revalidatePath(`/dashboard/teacher/courses/${courseId}`);
  revalidatePath("/dashboard/student/courses");

  return { enrolled: students.length };
}

export async function removeStudentFromCourse(courseId: string, studentId: string) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(courseId, actor);

  await prisma.courseEnrollment.deleteMany({
    where: {
      courseId,
      userId: studentId,
    },
  });

  revalidatePath(`/dashboard/teacher/courses/${courseId}`);
  revalidatePath("/dashboard/student/courses");
}

export async function getCourseStudents(courseId: string) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(courseId, actor);

  return prisma.courseEnrollment.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      role: true,
      createdAt: true,
    },
  });
}

export async function listAvailableStudents() {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  return prisma.user.findMany({
    where: { role: "GUEST" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function getTeacherCourseDetail(courseId: string) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);
  await assertCourseManagePermission(courseId, actor);

  return prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          assignments: true,
        },
      },
    },
  });
}

export async function listStudentCourses() {
  const actor = await getAuthenticatedActor();
  assertStudent(actor);

  return prisma.courseEnrollment.findMany({
    where: { userId: actor.id },
    orderBy: { createdAt: "desc" },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          archived: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              assignments: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });
}
