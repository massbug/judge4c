import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MdxRenderer } from "@/components/content/mdx-renderer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProblemSolutionFooter from "@/components/features/playground/problem/solution/footer";

interface ProblemSolutionPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProblemSolutionPage({
  params,
}: ProblemSolutionPageProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      title: true,
      solution: true,
    },
  });

  if (!problem) {
    notFound();
  }

  return (
    <>
      <div className="flex-1">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-130px)]">
          <MdxRenderer source={problem.solution} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <ProblemSolutionFooter title={problem.title} />
    </>
  );
}
