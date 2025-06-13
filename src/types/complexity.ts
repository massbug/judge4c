import { z } from "zod";

export const Complexity = z.enum([
  "O(1)",
  "O(logN)",
  "O(√N)",
  "O(N)",
  "O(NlogN)",
  "O(N^2)",
  "O(2^N)",
  "O(N!)",
]);

export type Complexity = z.infer<typeof Complexity>;

export const AnalyzeComplexityResponseSchema = z.object({
  time: Complexity,
  space: Complexity,
});

export type AnalyzeComplexityResponse = z.infer<
  typeof AnalyzeComplexityResponseSchema
>;
