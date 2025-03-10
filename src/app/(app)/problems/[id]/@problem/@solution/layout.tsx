import prisma from "@/lib/prisma";
import ProblemSolutionFooter from "@/features/playground/problem/solution/footer";

interface ProblemSolutionLayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function ProblemSolutionLayout({
  params,
  children,
}: ProblemSolutionLayoutProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: parseInt(id) },
    select: {
      title: true,
    },
  });

  const title = problem?.title ?? "";

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">{children}</div>
      <ProblemSolutionFooter title={title} />
    </div>
  );
}
