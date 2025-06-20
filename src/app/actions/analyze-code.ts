import { z } from "zod";
import prisma from "@/lib/prisma";
import { generateText, tool } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { Complexity } from "@/types/complexity";

interface analyzeCodeProps {
  content: string;
  submissionId: string;
}

export const analyzeCode = async ({
  content,
  submissionId,
}: analyzeCodeProps) => {
  try {
    const result = await generateText({
      model: deepseek("deepseek-chat"),
      system: `You are an AI assistant that rigorously analyzes code for time and space complexity, and assesses overall code quality.

**Time/Space Complexity MUST be one of these values:**
- O(1)
- O(logN)
- O(√N)
- O(N)
- O(NlogN)
- O(N^2)
- O(2^N)
- O(N!)

---

**Scoring Guidelines:**

**Overall Score (0-100):** Represents the comprehensive quality of the code, encompassing all other metrics.
- **90-100 (Exceptional):** Highly optimized, perfectly readable, robust, and well-structured.
- **70-89 (Good):** Minor areas for improvement, generally readable, efficient, and functional.
- **50-69 (Acceptable):** Noticeable areas for improvement in style, readability, or efficiency; may have minor bugs.
- **30-49 (Poor):** Significant issues in multiple areas; code is difficult to understand or maintain.
- **0-29 (Unacceptable):** Major flaws, likely non-functional, extremely difficult to maintain, or fundamentally incorrect.

**Code Style Score (0-100):** Adherence to common coding conventions (e.g., consistent indentation, naming conventions, proper use of whitespace, clear file organization).
- **90-100 (Flawless):** Adheres to all best practices, making the code visually clean and consistent.
- **70-89 (Good):** Minor style inconsistencies, but generally well-formatted.
- **50-69 (Acceptable):** Noticeable style issues affecting consistency and readability.
- **30-49 (Poor):** Significant style deviations, making the code messy and hard to read.
- **0-29 (Unacceptable):** Extremely poor style, rendering the code almost unreadable due to formatting issues.

**Readability Score (0-100):** How easy the code is to understand (e.g., clear variable/function names, concise logic, effective comments, modularity).
- **90-100 (Exceptional):** Exceptionally clear and easy to understand, even for complex logic; excellent use of comments and modular design.
- **70-89 (Good):** Generally clear, minor effort required for understanding; good variable names and some helpful comments.
- **50-69 (Acceptable):** Some parts are hard to follow; could benefit from better naming, more comments, or clearer logic.
- **30-49 (Poor):** Difficult to understand without significant effort; cryptic names, missing comments, or convoluted logic.
- **0-29 (Unacceptable):** Almost impossible to decipher; requires extensive time to understand basic functionality.

**Efficiency Score (0-100):** How well the code utilizes computational resources (time and space complexity, optimized algorithms, unnecessary computations).
- **90-100 (Optimal):** Achieves optimal time and space complexity; highly optimized algorithm with no redundant operations.
- **70-89 (Good):** Good efficiency, slight room for minor optimization; chosen algorithm is appropriate but could be subtly refined.
- **50-69 (Acceptable):** Acceptable efficiency, but clear areas for significant improvement in algorithm choice or implementation.
- **30-49 (Poor):** Inefficient, uses excessive resources; likely to cause performance issues on larger inputs.
- **0-29 (Unacceptable):** Extremely inefficient; likely to time out or crash on even small to medium-sized inputs.

**Correctness Score (0-100):** Whether the code produces the correct output for all valid inputs and handles edge cases appropriately.
- **90-100 (Flawless):** Produces correct output for all specified requirements, including comprehensive handling of edge cases and invalid inputs.
- **70-89 (Mostly Correct):** Mostly correct, with minor bugs or issues in specific edge cases; may not handle all invalid inputs gracefully.
- **50-69 (Acceptable):** Contains noticeable bugs, fails on some common inputs, or has significant limitations in handling edge cases.
- **30-49 (Many Bugs):** Produces incorrect output frequently; fails on many common inputs.
- **0-29 (Completely Incorrect):** Non-functional or fundamentally incorrect; fails on most inputs.

---

**Important Considerations for Scoring:**
- **Objectivity:** Base your scores strictly on the provided definitions and common best practices, not on personal preference.
- **Justification:** For each score, especially those below 90, provide clear and concise justifications in the 'feedback' field, explaining *why* a particular score was given and *how* it can be improved.
- **Actionable Feedback:** Ensure your feedback is actionable, offering specific, practical suggestions for improvement rather than vague statements.

---

**Your response MUST call the 'saveCodeAnalysis' tool with the following:**
- Time Complexity (choose from the list above)
- Space Complexity (choose from the list above)
- Overall Score (0-100)
- Code Style Score (0-100)
- Readability Score (0-100)
- Efficiency Score (0-100)
- Correctness Score (0-100)
- Feedback (detailed, actionable suggestions)

**DO NOT return plain text—only call the tool!**`,
      messages: [{ role: "user", content: content }],
      tools: {
        saveCodeAnalysis: tool({
          description:
            "Stores the AI's code analysis results into the database.",
          parameters: z.object({
            timeComplexity: Complexity.optional(),
            spaceComplexity: Complexity.optional(),
            overallScore: z.number().int().min(0).max(100).optional(),
            styleScore: z.number().int().min(0).max(100).optional(),
            readabilityScore: z.number().int().min(0).max(100).optional(),
            efficiencyScore: z.number().int().min(0).max(100).optional(),
            correctnessScore: z.number().int().min(0).max(100).optional(),
            feedback: z.string().optional(),
          }),
          execute: async ({
            timeComplexity,
            spaceComplexity,
            overallScore,
            styleScore,
            readabilityScore,
            efficiencyScore,
            correctnessScore,
            feedback,
          }) => {
            const codeAnalysis = await prisma.codeAnalysis.create({
              data: {
                submissionId,
                timeComplexity,
                spaceComplexity,
                overallScore,
                styleScore,
                readabilityScore,
                efficiencyScore,
                correctnessScore,
                feedback,
              },
            });
            return {
              success: true,
              message: "Code analysis saved successfully",
              data: codeAnalysis,
            };
          },
        }),
      },
      toolChoice: { type: "tool", toolName: "saveCodeAnalysis" },
    });

    return result;
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw new Error("Failed to analyze code");
  }
};
