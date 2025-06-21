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
  const languageServerConfigs = await prisma.languageServerConfig.findMany();

  return (
    <ProblemEditor
      problemId={problemId}
      templates={templates}
      languageServerConfigs={languageServerConfigs}
    />
  );
};

export const CodeContentSkeleton = () => {
  return <Loading />;
};
