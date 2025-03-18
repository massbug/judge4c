"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { authSchema } from "@/lib/zod";
import { CredentialsSignInFormValues } from "@/components/credentials-sign-in-form";
import { CredentialsSignUpFormValues } from "@/components/credentials-sign-up-form";

const saltRounds = 10;

export async function signInWithCredentials(formData: CredentialsSignInFormValues) {
  try {
    await signIn("credentials", {
      ...formData,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: "Invalid credentials" };
    }
    return { error: "Failed to sign in. Please try again." };
  }
}

export async function signUpWithCredentials(formData: CredentialsSignUpFormValues) {
  try {
    const validatedData = await authSchema.parseAsync(formData);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const pwHash = await bcrypt.hash(validatedData.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: pwHash,
      },
    });

    const count = await prisma.user.count();
    if (count === 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Registration failed. Please try again." };
  }
}
