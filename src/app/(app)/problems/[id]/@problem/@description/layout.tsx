import prisma from "@/lib/prisma";
import ProblemDescriptionFooter from "@/features/playground/problem/description/footer";

interface ProblemDescriptionLayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function ProblemDescriptionLayout({
  params,
  children,
}: ProblemDescriptionLayoutProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: parseInt(id) },
    select: {
      title: true,
    }
  });

  const title = problem?.title ?? "";

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">{children}</div>
      <ProblemDescriptionFooter title={title} />
    </div>
  );
}
