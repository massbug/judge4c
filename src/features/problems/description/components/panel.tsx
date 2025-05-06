import { Suspense } from "react";
import {
  DescriptionContent,
  DescriptionContentSkeleton,
} from "@/features/problems/description/components/content";

interface DescriptionPanelProps {
  id: string;
}

const DescriptionPanel = ({ id }: DescriptionPanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-3xl bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<DescriptionContentSkeleton />}>
            <DescriptionContent id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export { DescriptionPanel };
