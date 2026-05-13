import "server-only";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const apiKey = process.env.AI_API_KEY ?? "";
const baseURL = process.env.AI_BASE_URL ?? "https://api.deepseek.com";
export const modelId = process.env.AI_MODEL ?? "deepseek-chat";

export const aiProvider = createOpenAICompatible({
  name: "ai",
  apiKey,
  baseURL,
});

export const model = aiProvider(modelId);
