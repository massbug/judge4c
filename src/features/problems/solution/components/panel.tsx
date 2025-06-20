import { Suspense } from "react";
import {
  SolutionContent,
  SolutionContentSkeleton,
} from "@/features/problems/solution/components/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";

interface SolutionPanelProps {
  problemId: string;
}

export const SolutionPanel = ({ problemId }: SolutionPanelProps) => {
  return (
    <PanelLayout>
      <Suspense fallback={<SolutionContentSkeleton />}>
        <SolutionContent problemId={problemId} />
      </Suspense>
    </PanelLayout>
  );
};
