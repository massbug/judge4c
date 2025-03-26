"use client";

import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProblemSolutionFooter from "@/components/features/playground/problem/solution/footer";

export default function ProblemSolutionPage() {
  const { problem } = useProblem();

  return (
    <>
      <div className="flex-1">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-130px)] [&>[data-radix-scroll-area-viewport]>div:min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block">
          <MdxPreview source={problem.solution} className="p-4 md:p-6" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <ProblemSolutionFooter title={problem.title} />
    </>
  );
}
