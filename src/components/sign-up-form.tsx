import { GithubSignInForm } from "@/components/github-sign-in-form";
import { CredentialsSignUpForm } from "@/components/credentials-sign-up-form";

export function SignUpForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to sign up to your account
        </p>
      </div>
      <CredentialsSignUpForm />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <GithubSignInForm />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/sign-in" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </div>
  );
}
