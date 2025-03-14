import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { authSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CredentialsSignUp() {
  return (
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
            password: pwHash,
          },
        });

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
  );
}
