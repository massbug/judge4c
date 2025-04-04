"use client";

import { notFound } from "next/navigation";
import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function SolutionsPage() {
  const { problem } = useProblem();

  if (!problem) {
    notFound();
  }

  return (
    <div className="absolute h-full w-full">
      <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]>div:min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block bg-background">
        <MdxPreview source={problem.solution} className="p-4 md:p-6" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
