"use client";

import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { authSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithCredentials } from "@/actions/auth";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import { useTranslations } from 'next-intl';

export type CredentialsSignInFormValues = z.infer<typeof authSchema>;

export function CredentialsSignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<CredentialsSignInFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const onSubmit = (data: CredentialsSignInFormValues) => {
    startTransition(async () => {
      const result = await signInWithCredentials(data);

      if (result?.error) {
        toast.error("Sign In Failed", {
          description: result.error,
        });
      } else {
        toast.success("Signed In Successfully");
        router.push("/");
      }
    });
  };

  const t = useTranslations('');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="peer pe-9" {...field} />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <MailIcon size={16} aria-hidden="true" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="pe-9"
                    type={isVisible ? "text" : "password"}
                    {...field}
                  />
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <EyeOffIcon size={16} aria-hidden="true" />
                    ) : (
                      <EyeIcon size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t('sign-in-form.signing-in'): t('sign-up-form.sign-in')}
        </Button>
      </form>
    </Form>
  );
}
