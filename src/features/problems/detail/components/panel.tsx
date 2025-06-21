import { Suspense } from "react";
import {
  DetailContent,
  DetailContentSkeleton,
} from "@/features/problems/detail/components/content";
import { DetailHeader } from "@/features/problems/detail/components/header";

interface DetailPanelProps {
  submissionId: string | undefined;
}

export const DetailPanel = ({ submissionId }: DetailPanelProps) => {
  if (!submissionId) {
    return <DetailContentSkeleton />;
  }

  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <DetailHeader />
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<DetailContentSkeleton />}>
            <DetailContent submissionId={submissionId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
