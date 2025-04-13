import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubmissionsTable from "@/components/submissions-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SubmissionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      submissions: true,
    },
  });

  if (!problem) {
    return notFound();
  }

  return (
    <div className="px-3 flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <ScrollArea className="h-full">
        <SubmissionsTable submissions={problem.submissions} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
