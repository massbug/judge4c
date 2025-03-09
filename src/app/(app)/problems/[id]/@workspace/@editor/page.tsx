import prisma from "@/lib/prisma";
import CodeEditor from "@/components/code-editor";

interface WorkspaceEditorProps {
  params: Promise<{ id: string }>
}

export default async function WorkspaceEditorPage({
  params,
}: WorkspaceEditorProps) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: parseInt(id) },
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

  return <CodeEditor problemId={id} templates={templates} />;
}
