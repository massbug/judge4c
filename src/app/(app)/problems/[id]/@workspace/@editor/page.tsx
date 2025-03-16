import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CodeEditor from "@/components/code-editor";
import WorkspaceEditorHeader from "@/components/features/playground/workspace/editor/components/header";
import WorkspaceEditorFooter from "@/components/features/playground/workspace/editor/components/footer";

interface WorkspaceEditorProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceEditorPage({
  params,
}: WorkspaceEditorProps) {
  const { id } = await params;

  const [problem, editorLanguageConfigs, languageServerConfigs] = await Promise.all([
    prisma.problem.findUnique({
      where: { id },
      select: {
        templates: {
          select: {
            language: true,
            template: true,
          },
        },
      },
    }),
    prisma.editorLanguageConfig.findMany(),
    prisma.languageServerConfig.findMany(),
  ]);

  if (!problem) {
    return notFound();
  }

  const commonProps = {
    templates: problem.templates ?? [],
    editorLanguageConfigs,
    languageServerConfigs,
  };

  return (
    <>
      <WorkspaceEditorHeader {...commonProps} />
      <div className="flex-1">
        <CodeEditor problemId={id} {...commonProps} />
      </div>
      <WorkspaceEditorFooter />
    </>
  );
}
