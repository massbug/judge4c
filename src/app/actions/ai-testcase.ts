"use server";

import {AITestCaseInput, AITestCaseOutput, AITestCaseOutputSchema} from "@/types/ai-testcase";

import { deepseek } from "@/lib/ai";
import { CoreMessage, generateText } from "ai";
import prisma from "@/lib/prisma";


/**
 *
 * @param input
 * @returns
 */
export const generateAITestcase = async (
    input: AITestCaseInput
): Promise<AITestCaseOutput> => {
    const model = deepseek("deepseek-chat");

    let problemDetails = "";

    if (input.problemId) {
        try {
            // 尝试获取英文描述
            const problemLocalizationEn = await prisma.problemLocalization.findUnique({
                where: {
                    problemId_locale_type: {
                        problemId: input.problemId,
                        locale: "en",
                        type: "DESCRIPTION",
                    },
                },
                include: {
                    problem: true,
                },
            });

            if (problemLocalizationEn) {
                problemDetails = `
Problem Requirements:
-------------------
Description: ${problemLocalizationEn.content}
        `;
            } else {
                // 回退到中文描述
                const problemLocalizationZh = await prisma.problemLocalization.findUnique({
                    where: {
                        problemId_locale_type: {
                            problemId: input.problemId,
                            locale: "zh",
                            type: "DESCRIPTION",
                        },
                    },
                    include: {
                        problem: true,
                    },
                });

                if (problemLocalizationZh) {
                    problemDetails = `
Problem Requirements:
-------------------
Description: ${problemLocalizationZh.content}
        `;
                    console.warn(`Fallback to Chinese description for problemId: ${input.problemId}`);
                } else {
                    problemDetails = "Problem description not found in any language.";
                    console.warn(`No description found for problemId: ${input.problemId}`);
                }
            }
        } catch (error) {
            console.error("Failed to fetch problem details:", error);
            problemDetails = "Error fetching problem description.";
        }
    }



    // 构建AI提示词
    const prompt = `
Analyze the problem statement to get the expected input structure, constraints, and output logic. Generate **novel, randomized** inputs/outputs that strictly adhere to the problem's requirements. Focus on:
Your entire response/output is going to consist of a single JSON object {}, and you will NOT wrap it within JSON Markdown markers.

1. **Input Data Structure**: Identify required formats (e.g., arrays, integers, strings).
2. **Input Constraints**: Determine valid ranges (e.g., array length: 2–100, integers: -1000 to 1000) and edge cases.
3. **Output Logic**: Ensure outputs correctly reflect problem-specific operations.
4. **Randomization**: 
   Vary input magnitudes (mix min/max/-edge values with mid-range randomness)
   Use diverse data distributions (e.g., sorted/unsorted, negative/positive values)
   Avoid patterns from existing examples
   
Your entire response/output is going to consist of a single JSON object {}, and you will NOT wrap it within JSON Markdown markers.
   
Here is the problem description:

${problemDetails}

Respond **ONLY** with this JSON structure.
***Do not wrap the json codes in JSON markers*** :
{
  "expectedOutput": "Randomized output (e.g., [-5, 100] instead of [1, 2])",
  "inputs": [
    {
      "name": "Parameter 1",
      "value": <RANDOMIZED_DATA>  // Use string to wrap actual JSON types (arrays/numbers/strings)
    },
    ... // Add parameters as needed
  ]
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
        llmResponseJson = JSON.parse(text)


    } catch (error) {
        console.error("Failed to parse LLM response as JSON:", error);
        console.error("LLM raw output:", text);
        throw new Error("Invalid JSON response from LLM");
    }


    // 验证响应格式
    const validationResult = AITestCaseOutputSchema.safeParse(llmResponseJson);
    if (!validationResult.success) {
        console.error("Zod validation failed:", validationResult.error.format());
        throw new Error("Response validation failed");
    }

    console.log("LLM response:", llmResponseJson);
    return validationResult.data;
};