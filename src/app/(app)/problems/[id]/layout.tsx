import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProblemPage from "@/app/(app)/problems/[id]/page";
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
  Bot: React.ReactNode;
}

export default async function ProblemLayout({
  params,
  Description,
  Solutions,
  Submissions,
  Code,
  Testcase,
  TestResult,
  Bot,
}: ProblemProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const [
    problem,
    editorLanguageConfigs,
    languageServerConfigs,
    submissions,
  ] = await Promise.all([
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
    prisma.submission.findMany({
      where: { problemId: id },
    }),
  ]);

  if (!problem) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <ProblemStoreProvider
        problemId={id}
        problem={problem}
        editorLanguageConfigs={editorLanguageConfigs}
        languageServerConfigs={languageServerConfigs}
        submissions={submissions}
      >
        <PlaygroundHeader />
        <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
          <ProblemPage
            Description={Description}
            Solutions={Solutions}
            Submissions={Submissions}
            Code={Code}
            Testcase={Testcase}
            TestResult={TestResult}
            Bot={Bot}
          />
        </main>
      </ProblemStoreProvider>
    </div>
  );
}
