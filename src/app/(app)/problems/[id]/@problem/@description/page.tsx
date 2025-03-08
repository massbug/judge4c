import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MdxRenderer } from "@/components/content/mdx-renderer";

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
      <MdxRenderer source={problem.content} />
    </ScrollArea>
  );
}
