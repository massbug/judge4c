"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { GithubSignInForm } from "@/components/github-sign-in-form";
import { CredentialsSignUpForm } from "@/components/credentials-sign-up-form";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("SignUpForm");

  const handleSignIn = () => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/sign-in?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <CredentialsSignUpForm />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          {t("or")}
        </span>
      </div>
      <GithubSignInForm />
      <div className="text-center text-sm">
        {t("haveAccount")}{" "}
        <button
          onClick={handleSignIn}
          className="underline underline-offset-4"
        >
          {t("signIn")}
        </button>
      </div>
    </div>
  );
}
