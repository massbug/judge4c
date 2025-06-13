import { Suspense } from "react";
import {
  SubmissionContent,
  SubmissionContentSkeleton,
} from "@/features/problems/submission/components/content";

interface SubmissionPanelProps {
  problemId: string;
}

export const SubmissionPanel = ({ problemId }: SubmissionPanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<SubmissionContentSkeleton />}>
            <SubmissionContent problemId={problemId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
