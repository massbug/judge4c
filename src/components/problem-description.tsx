import { Suspense } from "react";
import remarkGfm from "remark-gfm";
import { compileMDX } from "next-mdx-remote/rsc";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProblemDescriptionProps {
  mdxSource: string;
}

export async function ProblemDescription({ mdxSource }: ProblemDescriptionProps) {
  try {
    const { content } = await compileMDX({
      source: mdxSource,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    });

    return (
      <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-56px)]">
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <div className="markdown-body">
            {content}
          </div>
        </Suspense>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  } catch (error) {
    console.error("Error compiling MDX:", error);
    return <Skeleton className="h-full w-full" />;
  }
}
