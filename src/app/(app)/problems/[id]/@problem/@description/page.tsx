import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MdxRenderer } from "@/components/content/mdx-renderer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProblemPageProps {
  params: Promise<{ id: string }>
}

export default async function ProblemPage({
  params
}: ProblemPageProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  if (!problem) {
    notFound();
  }

  return (
    <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-130px)]">
      <MdxRenderer source={problem.description} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
