import "server-only";

import { createDeepSeek } from "@ai-sdk/deepseek";

export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});
