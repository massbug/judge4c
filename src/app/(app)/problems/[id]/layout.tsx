import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PlaygroundHeader } from "@/components/features/playground/header";
import { ProblemEditorProvider } from "@/providers/problem-editor-provider";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface PlaygroundLayoutProps {
  params: Promise<{ id: string }>;
  problem: React.ReactNode;
  workspace: React.ReactNode;
  terminal: React.ReactNode;
}

export default async function PlaygroundLayout({
  params,
  problem,
  workspace,
  terminal,
}: PlaygroundLayoutProps) {
  const { id } = await params;

  const [
    problemData,
    editorLanguageConfigs,
    languageServerConfigs,
  ] = await Promise.all([
    prisma.problem.findUnique({
      where: { id },
      select: { templates: true },
    }),
    prisma.editorLanguageConfig.findMany(),
    prisma.languageServerConfig.findMany(),
  ]);

  if (!problemData) {
    return notFound();
  }

  return (
    <div className="h-screen flex flex-col">
      <ProblemEditorProvider
        problemId={id}
        templates={problemData.templates ?? []}
        editorLanguageConfigs={editorLanguageConfigs}
        languageServerConfigs={languageServerConfigs}
      >
        <PlaygroundHeader />
        <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
          <ResizablePanelGroup direction="horizontal" className="relative h-full flex">
            <ResizablePanel defaultSize={50} className="border border-muted rounded-xl min-w-9">
              {problem}
            </ResizablePanel>
            <ResizableHandle className="mx-1 bg-transparent hover:bg-blue-500" />
            <ResizablePanel defaultSize={50} className="min-w-9">
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
          </ResizablePanelGroup>
        </main>
      </ProblemEditorProvider>
    </div>
  );
}
