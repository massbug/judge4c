import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/generated/client";

export interface AuthenticatedActor {
  id: string;
  role: Role;
  name: string | null;
  email: string;
}

export async function getAuthenticatedActor(): Promise<AuthenticatedActor> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("用户未登录");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("用户不存在");
  }

  return user;
}

export function assertTeacherOrAdmin(actor: AuthenticatedActor) {
  if (actor.role !== "TEACHER" && actor.role !== "ADMIN") {
    throw new Error("无权限执行该操作");
  }
}

export function assertStudent(actor: AuthenticatedActor) {
  if (actor.role !== "GUEST") {
    throw new Error("仅学生可访问");
  }
}

export async function assertCourseManagePermission(
  courseId: string,
  actor: AuthenticatedActor
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      teacherId: true,
      title: true,
    },
  });

  if (!course) {
    throw new Error("课程不存在");
  }

  if (actor.role !== "ADMIN" && course.teacherId !== actor.id) {
    throw new Error("无权限操作该课程");
  }

  return course;
}

export async function assertCourseStudentPermission(
  courseId: string,
  actor: AuthenticatedActor
) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: actor.id,
      },
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          archived: true,
        },
      },
    },
  });

  if (!enrollment) {
    throw new Error("你未加入该课程");
  }

  if (enrollment.course.archived) {
    throw new Error("课程已归档");
  }

  return enrollment.course;
}
