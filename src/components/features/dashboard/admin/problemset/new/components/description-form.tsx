"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNewProblemStore } from "@/app/(app)/dashboard/@admin/problemset/new/store";
import { problemSchema } from "@/components/features/dashboard/admin/problemset/new/schema";
import { newProblemMetadataSchema } from "@/components/features/dashboard/admin/problemset/new/components/metadata-form";

export const newProblemDescriptionSchema = problemSchema.pick({
  description: true,
});

type NewProblemDescriptionSchema = z.infer<typeof newProblemDescriptionSchema>;

export default function NewProblemDescriptionForm() {
  const {
    hydrated,
    displayId,
    title,
    difficulty,
    published,
    description,
    setData,
  } = useNewProblemStore();
  const router = useRouter();

  const form = useForm<NewProblemDescriptionSchema>({
    resolver: zodResolver(newProblemDescriptionSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const onSubmit = (data: NewProblemDescriptionSchema) => {
    setData(data);
    router.push("/dashboard/problemset/new/solution");
  };

  useEffect(() => {
    if (!hydrated) return;

    try {
      newProblemMetadataSchema.parse({
        displayId,
        title,
        difficulty,
        published,
      });
    } catch {
      router.push("/dashboard/problemset/new/metadata");
    }
  }, [difficulty, displayId, hydrated, published, router, title]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your problem description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
