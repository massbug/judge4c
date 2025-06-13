import { Skeleton } from "@/components/ui/skeleton";
import { TestcaseTable } from "@/features/problems/testcase/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TestcaseContentProps {
  problemId: string;
}

export const TestcaseContent = ({ problemId }: TestcaseContentProps) => {
  return (
    <ScrollArea className="h-full">
      <TestcaseTable problemId={problemId} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export const TestcaseContentSkeleton = () => {
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
