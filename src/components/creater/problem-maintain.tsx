"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Difficulty, Locale, ProblemContentType, Language } from "@/generated/client";

export async function updateProblemDetail(problemId: string, data: { displayId?: number; difficulty?: Difficulty; timeLimit?: number; memoryLimit?: number; isPublished?: boolean }) {
  try {
    const updatedProblem = await prisma.problem.update({
      where: { id: problemId },
      data: {
        displayId: data.displayId,
        difficulty: data.difficulty,
        timeLimit: data.timeLimit,
        memoryLimit: data.memoryLimit,
        isPublished: data.isPublished
      }
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { success: true, problem: updatedProblem };
  } catch (error) {
    console.error("Failed to update problem detail:", error);
    return { success: false, error: "Failed to update problem detail" };
  }
}

export async function updateProblemDescription(problemId: string, locale: Locale, content: string) {
  try {
    const updatedLocalization = await prisma.problemLocalization.upsert({
      where: {
        problemId_locale_type: {
          problemId: problemId,
          locale: locale,
          type: ProblemContentType.DESCRIPTION
        }
      },
      create: {
        problemId: problemId,
        locale: locale,
        type: ProblemContentType.DESCRIPTION,
        content: content
      },
      update: {
        content: content
      }
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { success: true, localization: updatedLocalization };
  } catch (error) {
    console.error("Failed to update problem description:", error);
    return { success: false, error: "Failed to update problem description" };
  }
}

export async function updateProblemSolution(problemId: string, locale: Locale, content: string) {
  try {
    const updatedLocalization = await prisma.problemLocalization.upsert({
      where: {
        problemId_locale_type: {
          problemId: problemId,
          locale: locale,
          type: ProblemContentType.SOLUTION
        }
      },
      create: {
        problemId: problemId,
        locale: locale,
        type: ProblemContentType.SOLUTION,
        content: content
      },
      update: {
        content: content
      }
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { success: true, localization: updatedLocalization };
  } catch (error) {
    console.error("Failed to update problem solution:", error);
    return { success: false, error: "Failed to update problem solution" };
  }
}

export async function updateProblemTemplate(problemId: string, language: Language, content: string) {
  try {
    const updatedTemplate = await prisma.template.upsert({
      where: {
        problemId_language: {
          problemId: problemId,
          language: language
        }
      },
      create: {
        problemId: problemId,
        language: language,
        content: content
      },
      update: {
        content: content
      }
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { success: true, template: updatedTemplate };
  } catch (error) {
    console.error("Failed to update problem template:", error);
    return { success: false, error: "Failed to update problem template" };
  }
}

export async function updateProblemTestcase(problemId: string, testcaseId: string, expectedOutput: string, inputs: { name: string; value: string }[]) {
  try {
    // Update testcase
    const updatedTestcase = await prisma.testcase.update({
      where: { id: testcaseId },
      data: {
        expectedOutput: expectedOutput
      }
    });

    // Delete old inputs
    await prisma.testcaseInput.deleteMany({
      where: { testcaseId: testcaseId }
    });

    // Create new inputs
    const createdInputs = await prisma.testcaseInput.createMany({
      data: inputs.map((input, index) => ({
        testcaseId: testcaseId,
        index: index,
        name: input.name,
        value: input.value
      }))
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { 
      success: true, 
      testcase: updatedTestcase,
      inputs: createdInputs
    };
  } catch (error) {
    console.error("Failed to update problem testcase:", error);
    return { success: false, error: "Failed to update problem testcase" };
  }
}

export async function addProblemTestcase(problemId: string, expectedOutput: string, inputs: { name: string; value: string }[]) {
  try {
    // Create testcase
    const newTestcase = await prisma.testcase.create({
      data: {
        problemId: problemId,
        expectedOutput: expectedOutput
      }
    });

    // Create inputs
    const createdInputs = await prisma.testcaseInput.createMany({
      data: inputs.map((input, index) => ({
        testcaseId: newTestcase.id,
        index: index,
        name: input.name,
        value: input.value
      }))
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { 
      success: true, 
      testcase: newTestcase,
      inputs: createdInputs
    };
  } catch (error) {
    console.error("Failed to add problem testcase:", error);
    return { success: false, error: "Failed to add problem testcase" };
  }
}

export async function deleteProblemTestcase(problemId: string, testcaseId: string) {
  try {
    const deletedTestcase = await prisma.testcase.delete({
      where: { id: testcaseId }
    });

    revalidatePath(`/problem-editor/${problemId}`);
    return { success: true, testcase: deletedTestcase };
  } catch (error) {
    console.error("Failed to delete problem testcase:", error);
    return { success: false, error: "Failed to delete problem testcase" };
  }
}

/**
 * 更新题目标题（TITLE）
 */
export async function updateProblemTitle(
    problemId: string,
    locale: Locale,
    title: string
) {
  try {
    const updated = await prisma.problemLocalization.upsert({
      where: {
        problemId_locale_type: {
          problemId,
          locale,
          type: ProblemContentType.TITLE,
        },
      },
      create: {
        problemId,
        locale,
        type: ProblemContentType.TITLE,
        content: title,
      },
      update: {
        content: title,
      },
    });
    // 重新缓存编辑页
    revalidatePath(`/problem-editor/${problemId}`);
    return { success: true, localization: updated };
  } catch (error) {
    console.error("更新题目标题失败：", error);
    return { success: false, error: "更新题目标题失败" };
  }
}