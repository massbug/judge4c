import WorkspaceEditorHeader from "@/features/playground/workspace/editor/header";
import WorkspaceEditorFooter from "@/features/playground/workspace/editor/footer";

interface WorkspaceEditorLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceEditorLayout({
  children,
}: WorkspaceEditorLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <WorkspaceEditorHeader />
      <div className="flex-1">{children}</div>
      <WorkspaceEditorFooter />
    </div>
  );
}
