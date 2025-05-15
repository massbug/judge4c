import {
    OptimizeCodeInput,
    OptimizeCodeOutput,
    OptimizeCodeOutputSchema
} from "@/types/ai-improve";
import { openai } from "@/lib/ai";
import { CoreMessage, generateText } from "ai";

export const optimizeCode = async (
    input: OptimizeCodeInput
): Promise<OptimizeCodeOutput> => {
    const model = openai("gpt-4o-mini");

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

    Respond ONLY with the JSON object containing the optimized code and explanations.
    Format:
    {
        "optimizedCode": "optimized code here",
        "explanation": "explanation of changes made",
        "issuesFixed": ["list of issues fixed"]
    }
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
        console.error("Error generating text with OpenAI:", error);
        throw new Error("Failed to generate response from OpenAI");
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
        OptimizeCodeOutputSchema.safeParse(llmResponseJson);

    if (!validationResult.success) {
        console.error("Zod validation failed:", validationResult.error.format());
        throw new Error("Response validation failed");
    }

    return validationResult.data;
};