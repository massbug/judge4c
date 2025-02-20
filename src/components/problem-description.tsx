import { Suspense } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProblemDescriptionProps {
  mdxSource: string;
}

export function ProblemDescription({ mdxSource }: ProblemDescriptionProps) {
  return (
    <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-56px)]">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <div className="markdown-body">
          <MDXRemote source={mdxSource} />
        </div>
      </Suspense>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
