import { z } from "zod";

export const OptimizeCodeInputSchema = z.object({
    code: z.string(),
    error: z.string().optional(),
});

export type OptimizeCodeInput = z.infer<typeof OptimizeCodeInputSchema>;

export const OptimizeCodeOutputSchema = z.object({
    optimizedCode: z.string(),
    explanation: z.string(),
    issuesFixed: z.array(z.string()).optional(),
});

export type OptimizeCodeOutput = z.infer<typeof OptimizeCodeOutputSchema>;

