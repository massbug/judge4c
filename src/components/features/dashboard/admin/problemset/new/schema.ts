import { z } from "zod";
import { ProblemSchema } from "@/generated/zod";

export const problemSchema = ProblemSchema.extend({
  displayId: z.coerce.number().int().positive().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  solution: z.string().min(1),
});

export type ProblemSchema = z.infer<typeof problemSchema>;
