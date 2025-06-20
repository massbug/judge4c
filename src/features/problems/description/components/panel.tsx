import { Suspense } from "react";
import {
  DescriptionContent,
  DescriptionContentSkeleton,
} from "@/features/problems/description/components/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";

interface DescriptionPanelProps {
  problemId: string;
}

export const DescriptionPanel = ({ problemId }: DescriptionPanelProps) => {
  return (
    <PanelLayout>
      <Suspense fallback={<DescriptionContentSkeleton />}>
        <DescriptionContent problemId={problemId} />
      </Suspense>
    </PanelLayout>
  );
};
