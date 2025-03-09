import prisma from "@/lib/prisma";
import WorkspaceEditorHeader from "@/features/playground/workspace/editor/header";
import WorkspaceEditorFooter from "@/features/playground/workspace/editor/footer";

interface WorkspaceEditorLayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function WorkspaceEditorLayout({
  params,
  children,
}: WorkspaceEditorLayoutProps) {
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

  return (
    <div className="h-full flex flex-col">
      <WorkspaceEditorHeader templates={templates} />
      <div className="flex-1">{children}</div>
      <WorkspaceEditorFooter />
    </div>
  );
}
