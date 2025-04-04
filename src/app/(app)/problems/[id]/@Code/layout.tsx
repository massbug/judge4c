import { WorkspaceEditorHeader } from "@/components/features/playground/workspace/editor/components/header";
import { WorkspaceEditorFooter } from "@/components/features/playground/workspace/editor/components/footer";

interface CodeLayoutProps {
  children: React.ReactNode;
}

export default function CodeLayout({ children }: CodeLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <WorkspaceEditorHeader className="border-b border-x border-muted bg-background" />
      <div className="relative flex-1 border-x border-muted">
        {children}
      </div>
      <WorkspaceEditorFooter />
    </div>
  );
}
