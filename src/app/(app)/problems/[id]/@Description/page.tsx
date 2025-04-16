import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import MdxPreview from "@/components/mdx-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProblemDescriptionFooter from "@/components/features/playground/problem/description/footer";

interface DescriptionPageProps {
  params: Promise<{ id: string }>;
}

export default async function DescriptionPage({ params }: DescriptionPageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
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
            <MdxPreview source={problem.description} className="p-4 md:p-6" />
          </ScrollArea>
        </div>
      </div>
      <ProblemDescriptionFooter title={problem.title} />
    </>
  );
}
