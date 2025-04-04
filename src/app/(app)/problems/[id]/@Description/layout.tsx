"use client";

import { notFound } from "next/navigation";
import { useProblem } from "@/hooks/use-problem";
import ProblemDescriptionFooter from "@/components/features/playground/problem/description/footer";

interface DescriptionLayoutProps {
  children: React.ReactNode;
}

export default function DescriptionLayout({ children }: DescriptionLayoutProps) {
  const { problem } = useProblem();

  if (!problem) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <main className="relative flex-1 border-x border-muted">
        {children}
      </main>
      <ProblemDescriptionFooter title={problem.title} />
    </div>
  );
}
