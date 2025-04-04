"use client";

import { notFound } from "next/navigation";
import { useProblem } from "@/hooks/use-problem";
import ProblemSolutionFooter from "@/components/features/playground/problem/solution/footer";

interface SolutionsLayoutProps {
  children: React.ReactNode;
}

export default function SolutionsLayout({
  children,
}: SolutionsLayoutProps) {
  const { problem } = useProblem();

  if (!problem) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 border-x border-muted">
        {children}
      </div>
      <ProblemSolutionFooter title={problem.title} />
    </div>
  );
}
