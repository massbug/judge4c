import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import MdxPreview from "@/components/mdx-preview";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProblemSolutionFooter from "@/components/features/playground/problem/solution/footer";

interface SolutionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      title: true,
      solution: true,
    },
  });

  if (!problem) {
    return notFound();
  }

  return (
    <>
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]>div:min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block bg-background">
            <MdxPreview source={problem.solution} className="p-4 md:p-6" />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <ProblemSolutionFooter title={problem.title} />
    </>
  );
}
