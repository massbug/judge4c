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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Difficulty } from "@/generated/client";
import { Switch } from "@/components/ui/switch";
import { getDifficultyColorClass } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNewProblemStore } from "@/app/(app)/dashboard/@admin/problemset/new/store";
import { problemSchema } from "@/components/features/dashboard/admin/problemset/new/schema";

export const newProblemMetadataSchema = problemSchema.pick({
  displayId: true,
  title: true,
  difficulty: true,
  published: true,
});

type NewProblemMetadataSchema = z.infer<typeof newProblemMetadataSchema>;

export default function NewProblemMetadataForm() {
  const router = useRouter();
  const { displayId, title, difficulty, published, setData } = useNewProblemStore();

  const form = useForm<NewProblemMetadataSchema>({
    resolver: zodResolver(newProblemMetadataSchema),
    defaultValues: {
      // displayId must be a number and cannot be an empty string ("")
      // so set it to undefined here and convert it to "" in the Input component.
      displayId: displayId || undefined,
      title: title || "",
      difficulty: difficulty || "EASY",
      published: published || false,
    },
  });

  const onSubmit = (data: NewProblemMetadataSchema) => {
    setData(data);
    router.push("/dashboard/problemset/new/description");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="displayId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1001" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Unique numeric identifier visible to users
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Two Sum" {...field} />
              </FormControl>
              <FormDescription>
                Descriptive title summarizing the problem
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Difficulty).map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      <span className={getDifficultyColorClass(difficulty)}>
                        {difficulty}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Categorize problem complexity for better filtering
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5 mr-2">
                <FormLabel>Publish Status</FormLabel>
                <FormDescription>
                  Make problem visible in public listings
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
