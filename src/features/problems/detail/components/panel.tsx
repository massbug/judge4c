import { Suspense } from "react";
import {
  DetailContent,
  DetailContentSkeleton,
} from "@/features/problems/detail/components/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";
import { DetailHeader } from "@/features/problems/detail/components/header";

interface DetailPanelProps {
  submissionId: string | undefined;
}

export const DetailPanel = ({ submissionId }: DetailPanelProps) => {
  if (!submissionId) {
    return <DetailContentSkeleton />;
  }

  return (
    <PanelLayout>
      <DetailHeader />
      <Suspense fallback={<DetailContentSkeleton />}>
        <DetailContent submissionId={submissionId} />
      </Suspense>
    </PanelLayout>
  );
};
