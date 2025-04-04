import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DockView from "@/components/dockview";
import { ProblemStoreProvider } from "@/providers/problem-store-provider";
import { PlaygroundHeader } from "@/components/features/playground/header";

interface ProblemProps {
  params: Promise<{ id: string }>;
  Description: React.ReactNode;
  Solutions: React.ReactNode;
  Submissions: React.ReactNode;
  Code: React.ReactNode;
  Testcase: React.ReactNode;
  TestResult: React.ReactNode;
}

export default async function ProblemLayout({
  params,
  Description,
  Solutions,
  Submissions,
  Code,
  Testcase,
  TestResult,
}: ProblemProps) {
  const { id } = await params;

  const [
    problemData,
    editorLanguageConfigs,
    languageServerConfigs,
  ] = await Promise.all([
    prisma.problem.findUnique({
      where: { id },
      include: { templates: true },
    }),
    prisma.editorLanguageConfig.findMany(),
    prisma.languageServerConfig.findMany(),
  ]);

  if (!problemData) {
    return notFound();
  }

  const { templates, ...problemWithoutTemplates } = problemData;

  return (
    <div className="flex flex-col h-screen">
      <ProblemStoreProvider
        problemId={id}
        problem={problemWithoutTemplates}
        templates={templates}
        editorLanguageConfigs={editorLanguageConfigs}
        languageServerConfigs={languageServerConfigs}
      >
        <PlaygroundHeader />
        <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
          <DockView
            Description={Description}
            Solutions={Solutions}
            Submissions={Submissions}
            Code={Code}
            Testcase={Testcase}
            TestResult={TestResult}
          />
        </main>
      </ProblemStoreProvider>
    </div>
  );
}
