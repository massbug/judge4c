"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GithubSignInForm } from "@/components/github-sign-in-form";
import { CredentialsSignInForm } from "@/components/credentials-sign-in-form";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSignUp = () => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/sign-up?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>
      <CredentialsSignInForm />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <GithubSignInForm />
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <button
          onClick={handleSignUp}
          className="underline underline-offset-4"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
