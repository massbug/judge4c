import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CodeEditor } from "@/components/problem-editor";
import { ProblemEditorProvider } from "@/providers/problem-editor-provider";
import WorkspaceEditorHeader from "@/components/features/playground/workspace/editor/components/header";
import WorkspaceEditorFooter from "@/components/features/playground/workspace/editor/components/footer";

interface WorkspaceEditorProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceEditorPage({
  params,
}: WorkspaceEditorProps) {
  const { id } = await params;

  const [
    problem,
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

  if (!problem) {
    return notFound();
  }

  return (
    <ProblemEditorProvider
      problemId={id}
      templates={problem.templates ?? []}
      editorLanguageConfigs={editorLanguageConfigs}
      languageServerConfigs={languageServerConfigs}
    >
      <>
        <WorkspaceEditorHeader />
        <div className="flex-1">
          <CodeEditor />
        </div>
        <WorkspaceEditorFooter />
      </>
    </ProblemEditorProvider>
  );
}
