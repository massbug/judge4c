import { Suspense } from "react";
import {
  SolutionContent,
  SolutionContentSkeleton,
} from "@/features/problems/solution/components/content";

interface SolutionPanelProps {
  id: string;
}

const SolutionPanel = ({ id }: SolutionPanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-3xl bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<SolutionContentSkeleton />}>
            <SolutionContent id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export { SolutionPanel };
