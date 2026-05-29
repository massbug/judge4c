import { streamText, tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { model } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { Locale, ProblemContentType } from "@/generated/client";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, problemId, locale, submissionId } = await req.json();
  const userId = (await auth())?.user?.id;
  const activeLocale = locale === Locale.en ? Locale.en : Locale.zh;

  const system = `You are a patient programming tutor for Judge4c, a platform for learning C and C++.

Help users understand problems, debug code, and improve solutions with clear, respectful, and constructive guidance. When reviewing code, focus on correctness, edge cases, complexity, readability, and maintainability. Explain the reason behind each suggestion so the user can learn from it.

Prefer concise answers for simple questions. For debugging or refactoring, be specific and practical: point to the likely cause, suggest a minimal fix, and mention any important trade-offs. Avoid insults, sarcasm, profanity, or comments that shame the user.

Use tools when the user's question depends on current problem context. Use getCurrentCode for the latest editor code, getEditorDiagnostics for current editor errors and warnings, getProblemDescription for the statement, getProblemSolution for the official solution, getTestcases for configured test cases, getSubmissionHistory for the user's submissions, getSubmissionDetail for one submission's code and judge result, and getCodeAnalysis for code analysis scores, complexity, and feedback.

When the user asks about overall score, scoring details, code analysis feedback, time complexity, space complexity, or any analysis metric, call getCodeAnalysis before answering.

When providing code, keep it directly relevant to the user's question and avoid unnecessary rewrites. If the user is working on an algorithmic problem, do not reveal the full solution immediately unless they ask for it; start with hints or targeted guidance.

Reply in the user's language.`;

  const result = streamText({
    model,
    system: system,
    messages: messages,
    tools: {
      getCurrentCode: {
        description:
          "Get the latest code and language from the user's current editor.",
        parameters: z.object({}),
      },
      getEditorDiagnostics: {
        description:
          "Get the latest errors and warnings from the user's current editor diagnostics.",
        parameters: z.object({}),
      },
      getProblemDescription: tool({
        description: "Get the current problem statement.",
        parameters: z.object({}),
        execute: async () =>
          getProblemContent(problemId, activeLocale, ProblemContentType.DESCRIPTION),
      }),
      getProblemSolution: tool({
        description: "Get the current problem solution or editorial.",
        parameters: z.object({}),
        execute: async () =>
          getProblemContent(problemId, activeLocale, ProblemContentType.SOLUTION),
      }),
      getTestcases: tool({
        description: "Get the current problem's configured test cases.",
        parameters: z.object({}),
        execute: async () => {
          if (!problemId) return { error: "Missing problem id." };

          const testcases = await prisma.testcase.findMany({
            where: { problemId },
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              expectedOutput: true,
              inputs: {
                orderBy: { index: "asc" },
                select: {
                  name: true,
                  value: true,
                },
              },
            },
          });

          return { testcases };
        },
      }),
      getSubmissionHistory: tool({
        description: "Get the current user's submission history for this problem.",
        parameters: z.object({
          limit: z.number().int().min(1).max(20).optional(),
        }),
        execute: async ({ limit = 10 }) => {
          if (!userId) return { error: "User is not authenticated." };
          if (!problemId) return { error: "Missing problem id." };

          const submissions = await prisma.submission.findMany({
            where: { userId, problemId },
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              language: true,
              status: true,
              message: true,
              timeUsage: true,
              memoryUsage: true,
              createdAt: true,
            },
          });

          return { submissions };
        },
      }),
      getCodeAnalysis: tool({
        description:
          "Get code analysis scores, complexity, and feedback for one of the current user's submissions.",
        parameters: z.object({
          submissionId: z
            .string()
            .optional()
            .describe("Defaults to the submission currently open in the URL."),
        }),
        execute: async ({ submissionId: requestedSubmissionId }) => {
          if (!userId) return { error: "User is not authenticated." };

          const targetSubmissionId = requestedSubmissionId ?? submissionId;
          if (!targetSubmissionId) return { error: "Missing submission id." };

          const analysis = await prisma.codeAnalysis.findFirst({
            where: {
              submissionId: targetSubmissionId,
              submission: {
                userId,
              },
            },
            select: {
              id: true,
              submissionId: true,
              status: true,
              timeComplexity: true,
              spaceComplexity: true,
              overallScore: true,
              styleScore: true,
              readabilityScore: true,
              efficiencyScore: true,
              correctnessScore: true,
              feedback: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          return analysis ?? { error: "Code analysis not found." };
        },
      }),
      getSubmissionDetail: tool({
        description:
          "Get code, compile output, and judge runs for one of the current user's submissions.",
        parameters: z.object({
          submissionId: z
            .string()
            .optional()
            .describe("Defaults to the submission currently open in the URL."),
        }),
        execute: async ({ submissionId: requestedSubmissionId }) => {
          if (!userId) return { error: "User is not authenticated." };

          const targetSubmissionId = requestedSubmissionId ?? submissionId;
          if (!targetSubmissionId) return { error: "Missing submission id." };

          const submission = await prisma.submission.findFirst({
            where: { id: targetSubmissionId, userId },
            select: {
              id: true,
              language: true,
              content: true,
              status: true,
              message: true,
              timeUsage: true,
              memoryUsage: true,
              createdAt: true,
              judge: {
                select: {
                  status: true,
                  compileOutput: true,
                  judgeRuns: {
                    orderBy: { createdAt: "desc" },
                    select: {
                      status: true,
                      timeUsage: true,
                      memoryUsage: true,
                      stdin: true,
                      stdout: true,
                      stderr: true,
                      testcase: {
                        select: {
                          expectedOutput: true,
                          inputs: {
                            orderBy: { index: "asc" },
                            select: {
                              name: true,
                              value: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          return submission ?? { error: "Submission not found." };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

async function getProblemContent(
  problemId: string | undefined,
  locale: Locale,
  type: ProblemContentType
) {
  if (!problemId) return { error: "Missing problem id." };

  const localizations = await prisma.problemLocalization.findMany({
    where: { problemId, type },
    select: {
      locale: true,
      content: true,
    },
  });

  const content =
    localizations.find((item) => item.locale === locale)?.content ??
    localizations[0]?.content;

  return content ? { locale, content } : { error: "Content not found." };
}
