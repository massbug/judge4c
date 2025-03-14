import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
