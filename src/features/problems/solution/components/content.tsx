import { getCachedProblem } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { MdxRenderer } from "@/components/content/mdx-renderer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SolutionContentProps {
  id: string;
}

const SolutionContent = async ({ id }: SolutionContentProps) => {
  const problem = await getCachedProblem(id);

  return (
    <ScrollArea className="h-full">
      <MdxRenderer
        source={problem?.solution ?? "solution not found"}
        className="p-4 md:p-6"
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const SolutionContentSkeleton = () => {
  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-3/4 mb-6" />

      {/* Content skeletons */}
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-4/5 mb-4" />

      {/* Example section heading */}
      <Skeleton className="h-6 w-1/4 mb-4 mt-8" />

      {/* Example content */}
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-5/6 mb-4" />

      {/* Code block skeleton */}
      <div className="mb-6">
        <Skeleton className="h-40 w-full rounded-md" />
      </div>

      {/* More content */}
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-4" />
    </div>
  );
};

export { SolutionContent, SolutionContentSkeleton };
