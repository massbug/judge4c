"use server";

import prisma from "@/lib/prisma";
import {
  assertCourseManagePermission,
  assertCourseStudentPermission,
  assertStudent,
  assertTeacherOrAdmin,
  getAuthenticatedActor,
} from "@/app/(protected)/dashboard/actions/course-auth";

interface ProblemProgressRow {
  problemId: string;
  displayId: number;
  title: string;
  testcaseCount: number;
  passedTestcaseCount: number;
  solved: boolean;
  attempts: number;
  bestStatus: string;
}

function buildProblemProgressRows(
  assignmentProblems: {
    problemId: string;
    problem: {
      displayId: number;
      testcases: { id: string }[];
      localizations: { content: string }[];
    };
  }[],
  submissions: {
    problemId: string;
    status: string;
    judge: {
      judgeRuns: {
        testcaseId: string;
        status: string;
      }[];
    } | null;
  }[]
): ProblemProgressRow[] {
  const grouped = new Map<
    string,
    {
      attempts: number;
      solved: boolean;
      bestStatus: string;
      passedTestcaseCount: number;
    }
  >();

  for (const submission of submissions) {
    const current = grouped.get(submission.problemId) ?? {
      attempts: 0,
      solved: false,
      bestStatus: "PD",
      passedTestcaseCount: 0,
    };
    const passedTestcaseIds = new Set(
      submission.judge?.judgeRuns
        .filter((run) => run.status === "ACCEPTED")
        .map((run) => run.testcaseId) ?? []
    );

    current.attempts += 1;
    if (passedTestcaseIds.size > current.passedTestcaseCount) {
      current.passedTestcaseCount = passedTestcaseIds.size;
      current.bestStatus = submission.status;
    }
    if (submission.status === "AC") {
      current.solved = true;
      current.bestStatus = "AC";
      current.passedTestcaseCount = Math.max(
        current.passedTestcaseCount,
        passedTestcaseIds.size
      );
    } else if (!current.solved && current.bestStatus === "PD") {
      current.bestStatus = submission.status;
    }
    grouped.set(submission.problemId, current);
  }

  return assignmentProblems.map((item) => {
    const progress = grouped.get(item.problemId);
    const testcaseCount = item.problem.testcases.length;
    const solved = Boolean(progress?.solved);
    return {
      problemId: item.problemId,
      displayId: item.problem.displayId,
      title: item.problem.localizations[0]?.content ?? `题目${item.problem.displayId}`,
      testcaseCount,
      passedTestcaseCount: solved
        ? testcaseCount
        : progress?.passedTestcaseCount ?? 0,
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
          problem: {
            select: {
              displayId: true,
              testcases: {
                select: { id: true },
              },
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
          judge: {
            select: {
              judgeRuns: {
                select: {
                  testcaseId: true,
                  status: true,
                },
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

  await assertCourseManagePermission(assignment.courseId, actor);

  const problemCount = assignment.problems.length;
  const totalTestcases = assignment.problems.reduce(
    (total, problem) => total + problem.problem.testcases.length,
    0
  );

  const submissionGroup = new Map<
    string,
    {
      userId: string;
      problemId: string;
      status: string;
      judge: {
        judgeRuns: {
          testcaseId: string;
          status: string;
        }[];
      } | null;
    }[]
  >();
  for (const submission of assignment.submissions) {
    const bucket = submissionGroup.get(submission.userId) ?? [];
    bucket.push(submission);
    submissionGroup.set(submission.userId, bucket);
  }

  const students = assignment.course.enrollments.map((enrollment) => {
    const rows = buildProblemProgressRows(
      assignment.problems,
      submissionGroup.get(enrollment.userId) ?? []
    );
    const passedTestcaseCount = rows.reduce(
      (sum, row) => sum + row.passedTestcaseCount,
      0
    );
    const solvedCount = rows.filter((row) => row.solved).length;

    return {
      userId: enrollment.userId,
      name: enrollment.user.name,
      email: enrollment.user.email,
      passedTestcaseCount,
      totalTestcases,
      solvedCount,
      problemCount,
      perProblem: rows,
    };
  });

  const perProblemCoverage = assignment.problems.map((problem) => {
    const testcaseCount = problem.problem.testcases.length;
    const solvedUsers = students.filter((student) =>
      student.perProblem.some(
        (row) => row.problemId === problem.problemId && row.solved
      )
    ).length;
    const passedTestcaseCount = students.reduce((total, student) => {
      const row = student.perProblem.find(
        (item) => item.problemId === problem.problemId
      );
      return total + (row?.passedTestcaseCount ?? 0);
    }, 0);
    const totalUsers = students.length;
    return {
      problemId: problem.problemId,
      displayId: problem.problem.displayId,
      title:
        problem.problem.localizations[0]?.content ??
        `题目${problem.problem.displayId}`,
      passedTestcaseCount,
      testcaseCount,
      solvedUsers,
      totalUsers,
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
    problemCount,
    totalTestcases,
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
          problem: {
            select: {
              displayId: true,
              testcases: {
                select: { id: true },
              },
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
      judge: {
        select: {
          judgeRuns: {
            select: {
              testcaseId: true,
              status: true,
            },
          },
        },
      },
    },
  });

  const rows = buildProblemProgressRows(assignment.problems, submissions);
  const passedTestcaseCount = rows.reduce(
    (sum, row) => sum + row.passedTestcaseCount,
    0
  );
  const totalTestcases = rows.reduce((sum, row) => sum + row.testcaseCount, 0);
  const solvedCount = rows.filter((row) => row.solved).length;

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
    passedTestcaseCount,
    totalTestcases,
    solvedCount,
    problemCount: rows.length,
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
