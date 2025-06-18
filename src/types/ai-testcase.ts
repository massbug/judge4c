import {z} from "zod";

export const AITestCaseInputSchema = z.object({
    problemId: z.string(),
})

export type AITestCaseInput = z.infer<typeof AITestCaseInputSchema>

const input = z.object({
    name: z.string(),
    value: z.string()
})

export const AITestCaseOutputSchema = z.object({
    expectedOutput: z.string(),
    inputs: z.array(input)
})

export type AITestCaseOutput = z.infer<typeof AITestCaseOutputSchema>


