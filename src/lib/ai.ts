import "server-only";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const getRequiredEnv = (
  name: "AI_API_KEY" | "AI_BASE_URL" | "AI_MODEL",
): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const apiKey = getRequiredEnv("AI_API_KEY");

const baseURL = getRequiredEnv("AI_BASE_URL");

export const modelId = getRequiredEnv("AI_MODEL");

export const aiProvider = createOpenAICompatible({
  name: "ai",
  apiKey,
  baseURL,
});

export const model = aiProvider(modelId);
