"use server";

import {
    OptimizeCodeInput,
    OptimizeCodeOutput,
    OptimizeCodeOutputSchema,
} from "@/types/ai-improve";
import { openai } from "@/lib/ai";
import { CoreMessage, generateText } from "ai";
import prisma from "@/lib/prisma";

/**
 * 调用AI优化代码
 * @param input 包含代码、错误信息、题目ID的输入
 * @returns 优化后的代码和说明
 */
export const optimizeCode = async (
    input: OptimizeCodeInput
): Promise<OptimizeCodeOutput> => {
    const model = openai("gpt-4o-mini");

    // 获取题目详情（如果提供了problemId）
    let problemDetails = "";
    if (input.problemId) {
        try {
            const problem = await prisma.problem.findUnique({
                where: { id: input.problemId },
            });
            if (problem) {
                problemDetails = `
Problem Requirements:
-------------------
Description: ${problem.description}
        `;
            }
        } catch (error) {
            console.error("Failed to fetch problem details:", error);
        }
    }

    // 构建AI提示词
    const prompt = `
Analyze the following programming code for potential errors, inefficiencies or code style issues.
Provide an optimized version of the code with explanations. Focus on:
1. Fixing any syntax errors
2. Improving performance
3. Enhancing code readability 
4. Following best practices

Original code:
\`\`\`
${input.code}
\`\`\`

Error message (if any): ${input.error || "No error message provided"}

${problemDetails}

Respond ONLY with the JSON object containing the optimized code and explanations.
Format:
{
  "optimizedCode": "optimized code here",
  "explanation": "explanation of changes made",
  "issuesFixed": ["list of issues fixed"]
}
`;

    // 发送请求给OpenAI
    const messages: CoreMessage[] = [{ role: "user", content: prompt }];
    let text;
    try {
        const response = await generateText({
            model: model,
            messages: messages,
        });
        text = response.text;
    } catch (error) {
        console.error("Error generating text with OpenAI:", error);
        throw new Error("Failed to generate response from OpenAI");
    }

    // 解析LLM响应
    let llmResponseJson;
    try {
        const cleanedText = text.trim();
        llmResponseJson = JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse LLM response as JSON:", error);
        console.error("LLM raw output:", text);
        throw new Error("Invalid JSON response from LLM");
    }

    // 验证响应格式
    const validationResult = OptimizeCodeOutputSchema.safeParse(llmResponseJson);
    if (!validationResult.success) {
        console.error("Zod validation failed:", validationResult.error.format());
        throw new Error("Response validation failed");
    }

    return validationResult.data;
};