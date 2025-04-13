import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestcaseCard from "@/components/testcase-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestcasePageProps {
  params: Promise<{ id: string }>;
}

export default async function TestcasePage({ params }: TestcasePageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      testcases: {
        include: {
          data: true,
        },
      },
    },
  });

  if (!problem) {
    return notFound();
  }

  return (
    <div className="relative h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <div className="absolute h-full w-full">
        <ScrollArea className="h-full">
          <TestcaseCard testcases={problem.testcases} />
        </ScrollArea>
      </div>
    </div>
  );
}
