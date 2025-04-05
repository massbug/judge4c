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
import DockView from "@/components/dockview";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownEditor from "@/components/markdown-editor";
import { useNewProblemStore } from "@/app/(app)/dashboard/@admin/problemset/new/store";
import { problemSchema } from "@/components/features/dashboard/admin/problemset/new/schema";
import { newProblemMetadataSchema } from "@/components/features/dashboard/admin/problemset/new/components/metadata-form";

export const newProblemDescriptionSchema = problemSchema.pick({
  description: true,
});

type NewProblemDescriptionSchema = z.infer<
  typeof newProblemDescriptionSchema
>;

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
        className="h-full space-y-8 p-4"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="h-full flex flex-col">
              <FormLabel className="flex flex-none items-center justify-between">
                <span>Description</span>
                <Button className="h-8 w-auto" type="submit">
                  Next
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </Button>
              </FormLabel>
              <FormControl>
                <DockView
                  storageKey="dockview:new-problem"
                  options={[
                    {
                      id: "MdxPreview",
                      title: "Mdx Preview",
                      component: "MdxPreview",
                      tabComponent: "MdxPreview",
                      icon: "FileTextIcon",
                      node: (
                        <div className="h-full border-x border-muted relative">
                          <div className="absolute h-full w-full">
                            <ScrollArea className="h-full">
                              <MdxPreview
                                source={field.value}
                                className="p-4 md:p-6"
                              />
                            </ScrollArea>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "MarkdownEditor",
                      title: "Markdown Editor",
                      component: "MarkdownEditor",
                      tabComponent: "MarkdownEditor",
                      icon: "FileTextIcon",
                      node: (
                        <MarkdownEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      ),
                      position: { referencePanel: "MdxPreview", direction: "right" },
                    },
                  ]}
                />
              </FormControl>
              <FormDescription>
                This is your problem description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
