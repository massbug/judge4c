import WorkspaceEditorHeader from "@/app/(app)/playground/@workspace/@editor/components/header";
import WorkspaceEditorFooter from "@/app/(app)/playground/@workspace/@editor/components/footer";

interface WorkspaceEditorLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceEditorLayout({
  children,
}: WorkspaceEditorLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <WorkspaceEditorHeader />
      {children}
      <WorkspaceEditorFooter />
    </div>
  );
}
