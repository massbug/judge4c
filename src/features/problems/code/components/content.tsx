import prisma from "@/lib/prisma";
import { Loading } from "@/components/loading";
import { ProblemEditor } from "@/components/problem-editor";

interface CodeContentProps {
  problemId: string;
}

export const CodeContent = async ({ problemId }: CodeContentProps) => {
  const templates = await prisma.template.findMany({
    where: {
      problemId,
    },
  });

  return <ProblemEditor problemId={problemId} templates={templates} />;
};

export const CodeContentSkeleton = () => {
  return <Loading />;
};
