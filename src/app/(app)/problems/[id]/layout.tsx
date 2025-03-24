import prisma from "@/lib/prisma";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { notFound } from "next/navigation";
import { ProblemStoreProvider } from "@/providers/problem-store-provider";
import { PlaygroundHeader } from "@/components/features/playground/header";

interface PlaygroundLayoutProps {
  params: Promise<{ id: string }>;
  problem: React.ReactNode;
  workspace: React.ReactNode;
  terminal: React.ReactNode;
  ai: React.ReactNode;
}

export default async function PlaygroundLayout({
  params,
  problem,
  workspace,
  terminal,
  ai,
}: PlaygroundLayoutProps) {
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
    <div className="h-screen flex flex-col">
      <ProblemStoreProvider
        problemId={id}
        problem={problemWithoutTemplates}
        templates={templates}
        editorLanguageConfigs={editorLanguageConfigs}
        languageServerConfigs={languageServerConfigs}
      >
        <PlaygroundHeader />
        <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
          <ResizablePanelGroup direction="horizontal" className="relative h-full flex">
            <ResizablePanel defaultSize={30} className="border border-muted rounded-xl min-w-9">
              {problem}
            </ResizablePanel>
            <ResizableHandle className="mx-1 bg-transparent hover:bg-blue-500" />
            <ResizablePanel defaultSize={40} className="min-w-9">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50} className="border border-muted rounded-xl min-h-9">
                  {workspace}
                </ResizablePanel>
                <ResizableHandle className="my-1 bg-transparent hover:bg-blue-500" />
                <ResizablePanel defaultSize={50} className="border border-muted rounded-xl min-h-9">
                  {terminal}
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle className="mx-1 bg-transparent hover:bg-blue-500" />
            <ResizablePanel defaultSize={30} className="border border-muted rounded-xl min-w-9">
              {ai}
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </ProblemStoreProvider>
    </div>
  );
}

export async function generateStaticParams() {
  const problems = await prisma.problem.findMany({
    select: { id: true },
  });

  return problems.map((problem) => ({
    id: problem.id,
  }));
}
