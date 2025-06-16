"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { authSchema } from "@/lib/zod";
import { getTranslations } from "next-intl/server";
import { CredentialsSignInFormValues } from "@/components/credentials-sign-in-form";
import { CredentialsSignUpFormValues } from "@/components/credentials-sign-up-form";

const saltRounds = 10;

export const signInWithCredentials = async (
  formData: CredentialsSignInFormValues
) => {
  const t = await getTranslations("signInWithCredentials");

  try {
    // Parse credentials using authSchema for validation
    const { email, password } = await authSchema.parseAsync(formData);

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Check if the user exists
    if (!user) {
      throw new Error(t("userNotFound"));
    }

    // Check if the user has a password
    if (!user.password) {
      throw new Error(t("invalidCredentials"));
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error(t("incorrectPassword"));
    }

    await signIn("credentials", {
      ...formData,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : t("signInFailedFallback"),
    };
  }
};

export const signUpWithCredentials = async (
  formData: CredentialsSignUpFormValues
) => {
  const t = await getTranslations("signUpWithCredentials");

  try {
    const validatedData = await authSchema.parseAsync(formData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      throw new Error(t("userAlreadyExists"));
    }

    // Hash password and create user
    const pwHash = await bcrypt.hash(validatedData.password, saltRounds);
    const user = await prisma.user.create({
      data: { email: validatedData.email, password: pwHash },
    });

    // Assign admin role if first user
    const userCount = await prisma.user.count();
    if (userCount === 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
    }

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : t("registrationFailedFallback"),
    };
  }
};
