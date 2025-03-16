import prisma from "@/lib/prisma";
import CodeEditor from "@/components/code-editor";
import WorkspaceEditorHeader from "@/components/features/playground/workspace/editor/components/header";
import WorkspaceEditorFooter from "@/components/features/playground/workspace/editor/components/footer";

interface WorkspaceEditorProps {
  params: Promise<{ id: string }>
}

export default async function WorkspaceEditorPage({
  params,
}: WorkspaceEditorProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: {
      templates: {
        select: {
          language: true,
          template: true,
        }
      }
    }
  });

  const templates = problem?.templates ?? [];

  return (
    <>
      <WorkspaceEditorHeader templates={templates} />
      <div className="flex-1">
        <CodeEditor problemId={id} templates={templates} />
      </div>
      <WorkspaceEditorFooter />
    </>
  )
}
