import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProblemStoreProvider } from "@/providers/problem-store-provider";
import { PlaygroundHeader } from "@/components/features/playground/header";

interface ProblemProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function ProblemLayout({
  params,
  children,
}: ProblemProps) {
  const { id } = await params;

  const [problemData, editorLanguageConfigs, languageServerConfigs] =
    await Promise.all([
      prisma.problem.findUnique({
        where: { id },
        include: {
          templates: true,
          testcases: {
            include: {
              data: true,
            },
          },
        },
      }),
      prisma.editorLanguageConfig.findMany(),
      prisma.languageServerConfig.findMany(),
    ]);

  if (!problemData) {
    return notFound();
  }

  const { templates, testcases, ...problemWithoutTemplates } = problemData;

  return (
    <div className="flex flex-col h-screen">
      <ProblemStoreProvider
        problemId={id}
        problem={problemWithoutTemplates}
        templates={templates}
        testcases={testcases}
        editorLanguageConfigs={editorLanguageConfigs}
        languageServerConfigs={languageServerConfigs}
      >
        <PlaygroundHeader />
        <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
          {children}
        </main>
      </ProblemStoreProvider>
    </div>
  );
}
