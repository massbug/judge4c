import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { authSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GithubSignIn } from "@/components/github-sign-in";

export function SignUpForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to sign up to your account
        </p>
      </div>
      <form
        className="grid gap-6"
        action={async (formData) => {
          "use server";
          const email = formData.get("email");
          const password = formData.get("password");
          const validatedData = await authSchema.parseAsync({ email, password });
          const saltRounds = 10;
          const pwHash = await bcrypt.hash(validatedData.password, saltRounds);
          await prisma.user.create({
            data: {
              email: validatedData.email,
              password: pwHash
            }
          })
          redirect("/sign-in");
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <GithubSignIn />
      <div className="text-center text-sm">
        Already have an account? {" "}
        <a href="/sign-in" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </div>
  )
}
