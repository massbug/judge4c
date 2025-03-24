"use client";

import { notFound } from "next/navigation";
import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProblemDescriptionFooter from "@/components/features/playground/problem/description/footer";

export default function ProblemDescriptionPage() {
  const { problem } = useProblem();

  if (!problem) {
    notFound();
  }

  return (
    <>
      <div className="flex-1">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-130px)]">
          <MdxPreview source={problem.description} className="box-border min-w-[200px] max-w-[980px] mx-auto p-4 md:p-6" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <ProblemDescriptionFooter title={problem.title} />
    </>
  );
}
