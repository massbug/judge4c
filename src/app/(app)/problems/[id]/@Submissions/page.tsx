import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUserLocale } from "@/i18n/locale";
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
      submissions: {
        include: {
          testcaseResults: {
            include: {
              testcase: {
                include: {
                  data: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!problem) {
    return notFound();
  }

  const locale = await getUserLocale();

  return (
    <div className="px-3 flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <ScrollArea className="h-full">
        <SubmissionsTable locale={locale} submissions={problem.submissions} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
