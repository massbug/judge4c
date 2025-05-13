import { Suspense } from "react";
import {
  SolutionContent,
  SolutionContentSkeleton,
} from "@/features/problems/solution/components/content";

interface SolutionPanelProps {
  problemId: string;
}

export const SolutionPanel = ({ problemId }: SolutionPanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-3xl bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<SolutionContentSkeleton />}>
            <SolutionContent problemId={problemId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
