import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DetailTable } from "@/features/problems/detail/components/table";

interface DetailContentProps {
  submissionId: string;
}

export const DetailContent = ({ submissionId }: DetailContentProps) => {
  return (
    <ScrollArea className="h-full">
      <DetailTable submissionId={submissionId} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export const DetailContentSkeleton = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute h-full w-full p-4 md:p-6">
        {/* Title skeleton */}
        <Skeleton className="mb-6 h-8 w-3/4" />

        {/* Content skeletons */}
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-5/6" />
        <Skeleton className="mb-4 h-4 w-2/3" />
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-4/5" />

        {/* Example section heading */}
        <Skeleton className="mb-4 mt-8 h-6 w-1/4" />

        {/* Example content */}
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-5/6" />

        {/* Code block skeleton */}
        <div className="mb-6">
          <Skeleton className="h-40 w-full rounded-md" />
        </div>

        {/* More content */}
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />
      </div>
    </div>
  );
};
