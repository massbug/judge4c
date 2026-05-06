"use server";

import prisma from "@/lib/prisma";
import {
  assertCourseManagePermission,
  assertCourseStudentPermission,
  assertStudent,
  assertTeacherOrAdmin,
  getAuthenticatedActor,
} from "@/app/(protected)/dashboard/actions/course-auth";

interface ProblemScoreRow {
  problemId: string;
  displayId: number;
  title: string;
  maxPoints: number;
  earnedPoints: number;
  solved: boolean;
  attempts: number;
  bestStatus: string;
}

function buildProblemScoreRows(
  assignmentProblems: {
    problemId: string;
    maxPoints: number;
    problem: {
      displayId: number;
      localizations: { content: string }[];
    };
  }[],
  submissions: {
    problemId: string;
    status: string;
  }[]
): ProblemScoreRow[] {
  const grouped = new Map<
    string,
    {
      attempts: number;
      solved: boolean;
      bestStatus: string;
    }
  >();

  for (const submission of submissions) {
    const current = grouped.get(submission.problemId) ?? {
      attempts: 0,
      solved: false,
      bestStatus: "PD",
    };
    current.attempts += 1;
    if (submission.status === "AC") {
      current.solved = true;
      current.bestStatus = "AC";
    } else if (!current.solved) {
      current.bestStatus = submission.status;
    }
    grouped.set(submission.problemId, current);
  }

  return assignmentProblems.map((item) => {
    const progress = grouped.get(item.problemId);
    const solved = Boolean(progress?.solved);
    return {
      problemId: item.problemId,
      displayId: item.problem.displayId,
      title: item.problem.localizations[0]?.content ?? `题目${item.problem.displayId}`,
      maxPoints: item.maxPoints,
      earnedPoints: solved ? item.maxPoints : 0,
      solved,
      attempts: progress?.attempts ?? 0,
      bestStatus: progress?.bestStatus ?? "-",
    };
  });
}

export async function getTeacherAssignmentStats(assignmentId: string) {
  const actor = await getAuthenticatedActor();
  assertTeacherOrAdmin(actor);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      title: true,
      courseId: true,
      dueAt: true,
      published: true,
      course: {
        select: {
          id: true,
          title: true,
          teacherId: true,
          enrollments: {
            select: {
              userId: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      problems: {
        orderBy: [{ order: "asc" }, { problem: { displayId: "asc" } }],
        select: {
          problemId: true,
          maxPoints: true,
          problem: {
            select: {
              displayId: true,
              localizations: {
                where: { type: "TITLE", locale: "zh" },
                select: { content: true },
              },
            },
          },
        },
      },
      submissions: {
        select: {
          userId: true,
          problemId: true,
          status: true,
        },
      },
    },
  });

  if (!assignment) {
    throw new Error("作业不存在");
  }

  await assertCourseManagePermission(assignment.courseId, actor);

  const problemCount = assignment.problems.length;
  const maxScore = assignment.problems.reduce(
    (total, problem) => total + problem.maxPoints,
    0
  );

  const submissionGroup = new Map<
    string,
    { userId: string; problemId: string; status: string }[]
  >();
  for (const submission of assignment.submissions) {
    const bucket = submissionGroup.get(submission.userId) ?? [];
    bucket.push(submission);
    submissionGroup.set(submission.userId, bucket);
  }

  const students = assignment.course.enrollments.map((enrollment) => {
    const rows = buildProblemScoreRows(
      assignment.problems,
      submissionGroup.get(enrollment.userId) ?? []
    );
    const score = rows.reduce((sum, row) => sum + row.earnedPoints, 0);
    const solvedCount = rows.filter((row) => row.solved).length;
    const completionPercent =
      problemCount > 0 ? Math.round((solvedCount / problemCount) * 100) : 0;

    return {
      userId: enrollment.userId,
      name: enrollment.user.name,
      email: enrollment.user.email,
      totalScore: score,
      maxScore,
      solvedCount,
      problemCount,
      completionPercent,
      perProblem: rows,
    };
  });

  const perProblemCoverage = assignment.problems.map((problem) => {
    const solvedUsers = students.filter((student) =>
      student.perProblem.some(
        (row) => row.problemId === problem.problemId && row.solved
      )
    ).length;
    const totalUsers = students.length;
    return {
      problemId: problem.problemId,
      displayId: problem.problem.displayId,
      title:
        problem.problem.localizations[0]?.content ??
        `题目${problem.problem.displayId}`,
      solvedUsers,
      totalUsers,
      acCoverage:
        totalUsers > 0 ? Math.round((solvedUsers / totalUsers) * 100) : 0,
    };
  });

  return {
    assignment: {
      id: assignment.id,
      title: assignment.title,
      dueAt: assignment.dueAt,
      published: assignment.published,
    },
    course: {
      id: assignment.course.id,
      title: assignment.course.title,
    },
    maxScore,
    problemCount,
    students,
    perProblemCoverage,
  };
}

export async function getStudentAssignmentSummary(assignmentId: string) {
  const actor = await getAuthenticatedActor();
  assertStudent(actor);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      title: true,
      description: true,
      dueAt: true,
      opensAt: true,
      published: true,
      courseId: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      problems: {
        orderBy: [{ order: "asc" }, { problem: { displayId: "asc" } }],
        select: {
          problemId: true,
          maxPoints: true,
          problem: {
            select: {
              displayId: true,
              localizations: {
                where: { type: "TITLE", locale: "zh" },
                select: { content: true },
              },
            },
          },
        },
      },
    },
  });

  if (!assignment) {
    throw new Error("作业不存在");
  }
  if (!assignment.published) {
    throw new Error("作业未发布");
  }

  await assertCourseStudentPermission(assignment.courseId, actor);

  const submissions = await prisma.submission.findMany({
    where: {
      assignmentId,
      userId: actor.id,
    },
    select: {
      problemId: true,
      status: true,
    },
  });

  const rows = buildProblemScoreRows(assignment.problems, submissions);
  const totalScore = rows.reduce((sum, row) => sum + row.earnedPoints, 0);
  const maxScore = rows.reduce((sum, row) => sum + row.maxPoints, 0);
  const solvedCount = rows.filter((row) => row.solved).length;
  const completionPercent =
    rows.length > 0 ? Math.round((solvedCount / rows.length) * 100) : 0;

  return {
    assignment: {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueAt: assignment.dueAt,
      opensAt: assignment.opensAt,
      published: assignment.published,
    },
    course: assignment.course,
    totalScore,
    maxScore,
    solvedCount,
    problemCount: rows.length,
    completionPercent,
    rows,
  };
}

export async function listStudentAssignments(courseId: string) {
  const actor = await getAuthenticatedActor();
  assertStudent(actor);
  await assertCourseStudentPermission(courseId, actor);

  return prisma.assignment.findMany({
    where: {
      courseId,
      published: true,
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      opensAt: true,
      dueAt: true,
      _count: {
        select: {
          problems: true,
        },
      },
    },
  });
}

export async function getStudentCourseDetail(courseId: string) {
  const actor = await getAuthenticatedActor();
  assertStudent(actor);
  await assertCourseStudentPermission(courseId, actor);

  return prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}
