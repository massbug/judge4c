import { Suspense } from "react";
import {
  SubmissionContent,
  SubmissionContentSkeleton,
} from "@/features/problems/submission/components/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";

interface SubmissionPanelProps {
  problemId: string;
}

export const SubmissionPanel = ({ problemId }: SubmissionPanelProps) => {
  return (
    <PanelLayout>
      <Suspense fallback={<SubmissionContentSkeleton />}>
        <SubmissionContent problemId={problemId} />
      </Suspense>
    </PanelLayout>
  );
};
