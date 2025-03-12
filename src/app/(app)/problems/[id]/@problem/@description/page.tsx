import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MdxRenderer } from "@/components/content/mdx-renderer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProblemDescriptionFooter from "@/features/playground/problem/description/footer";

interface ProblemDescriptionPageProps {
  params: Promise<{ id: string }>
}

export default async function ProblemDescriptionPage({
  params
}: ProblemDescriptionPageProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: parseInt(id) },
    select: {
      title: true,
      description: true,
    }
  });

  if (!problem) {
    notFound();
  }

  return (
    <>
      <div className="flex-1">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-130px)]">
          <MdxRenderer source={problem.description} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <ProblemDescriptionFooter title={problem.title} />
    </>
  );
}
