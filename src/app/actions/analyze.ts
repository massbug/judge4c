"use server";

import {
  AnalyzeComplexityResponse,
  AnalyzeComplexityResponseSchema,
  Complexity,
} from "@/types/complexity";
import prisma from "@/lib/prisma";
import { openai } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { CoreMessage, generateText } from "ai";
import { CodeAnalysis } from "@/generated/client";

export const analyzeComplexity = async (
  content: string
): Promise<AnalyzeComplexityResponse> => {
  const model = openai("gpt-4o-mini");

  const prompt = `
  Analyze the time and space complexity of the following programming code snippet.
  Determine the Big O notation from this list: ${Complexity.options.join(", ")}.
  Provide your response as a JSON object with one key:
  1. "time": A string representing the time complexity (e.g., "O(N)", "O(N^2)").
  2. "space": A string representing the space complexity (e.g., "O(1)", "O(N)").
  
  Code to analyze:
  \`\`\`
  ${content}
  \`\`\`

  Respond ONLY with the JSON object. Do not include any other text or markdown formmating like \`\`\`json before or after the object.
  `;

  const messages: CoreMessage[] = [{ role: "user", content: prompt }];

  let text;
  try {
    const response = await generateText({
      model: model,
      messages: messages,
    });
    text = response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate response from LLM");
  }

  let llmResponseJson;
  try {
    const cleanedText = text.trim();
    llmResponseJson = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse LLM response as JSON:", error);
    console.error("LLM raw output:", text);
    throw new Error("Invalid JSON response from LLM");
  }

  const validationResult =
    AnalyzeComplexityResponseSchema.safeParse(llmResponseJson);

  if (!validationResult.success) {
    console.error("Zod validation failed:", validationResult.error.format());
    throw new Error("Response validation failed");
  }

  return validationResult.data;
};

export const getAnalysis = async (
  submissionId: string
): Promise<CodeAnalysis> => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error(
      "Authentication required: Please log in to submit code for analysis"
    );
  }

  const analysis = await prisma.codeAnalysis.findUnique({
    where: { submissionId: submissionId },
  });

  if (!analysis) {
    throw new Error("Analysis not found");
  }

  return analysis;
};

export const optimizeCode = async (content: string): Promise<string> => {
  const model = openai("gpt-4o-mini");

  const prompt = `
  Optimize the following code snippet for better performance, readability, and maintainability.
  Provide ONLY the improved code without any explanations, comments, or additional text.
  
  Code to optimize:
  \`\`\`
  ${content}
  \`\`\`

  Respond ONLY with the optimized code. Do not include any other text or markdown formatting like \`\`\`.
  `;

  const messages: CoreMessage[] = [{ role: "user", content: prompt }];

  try {
    const response = await generateText({
      model: model,
      messages: messages,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error optimizing code:", error);
    throw new Error("Failed to optimize code");
  }
};
