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
import { newProblemDescriptionSchema } from "@/components/features/dashboard/admin/problemset/new/components/description-form";

const newProblemSolutionSchema = problemSchema.pick({
  solution: true,
});

type NewProblemSolutionSchema = z.infer<typeof newProblemSolutionSchema>;

export default function NewProblemSolutionForm() {
  const {
    hydrated,
    displayId,
    title,
    difficulty,
    published,
    description,
    solution,
  } = useNewProblemStore();
  const router = useRouter();

  const form = useForm<NewProblemSolutionSchema>({
    resolver: zodResolver(newProblemSolutionSchema),
    defaultValues: {
      solution: solution || "",
    },
  });

  const onSubmit = (data: NewProblemSolutionSchema) => {
    console.log({
      ...data,
      displayId,
      title,
      difficulty,
      published,
      description,
    });
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

    try {
      newProblemDescriptionSchema.parse({ description });
    } catch {
      router.push("/dashboard/problemset/new/description");
    }
  }, [hydrated, displayId, title, difficulty, published, description, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solution</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your problem solution.
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
