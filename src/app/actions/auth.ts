"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { authSchema } from "@/lib/zod";
import { redirect } from "next/navigation";

const saltRounds = 10;

export async function signInWithCredentials(formData: { email: string; password: string }) {
  await signIn("credentials", formData);
}

export async function signUpWithCredentials(formData: { email: string; password: string }) {
  const validatedData = await authSchema.parseAsync(formData);

  const pwHash = await bcrypt.hash(validatedData.password, saltRounds);

  await prisma.user.create({
    data: {
      email: validatedData.email,
      password: pwHash,
    },
  });

  redirect("/sign-in");
}
