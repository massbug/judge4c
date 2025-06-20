import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProblemHeader } from "@/features/problems/components/header";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ problemId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { problemId } = await params;

  if (!problemId) {
    return notFound();
  }

  const problem = await prisma.problem.findUnique({
    select: {
      isPublished: true,
    },
    where: {
      id: problemId,
    },
  });

  if (!problem?.isPublished) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <ProblemHeader />
      <div className="flex w-full flex-grow overflow-y-hidden p-2.5 pt-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;
