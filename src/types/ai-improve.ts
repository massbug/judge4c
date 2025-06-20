import { z } from "zod";

// 优化代码的输入类型
export const OptimizeCodeInputSchema = z.object({
  code: z.string(), // 用户输入的代码
  error: z.string().optional(), // 可选的错误信息
  problemId: z.string().optional(), // 可选的题目ID
});

export type OptimizeCodeInput = z.infer<typeof OptimizeCodeInputSchema>;

// 优化代码的输出类型
export const OptimizeCodeOutputSchema = z.object({
  optimizedCode: z.string(), // 优化后的代码
  explanation: z.string(), // 优化说明
  issuesFixed: z.array(z.string()).optional(), // 修复的问题列表
});

export type OptimizeCodeOutput = z.infer<typeof OptimizeCodeOutputSchema>;
