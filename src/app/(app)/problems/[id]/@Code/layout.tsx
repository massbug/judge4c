import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { WorkspaceEditorHeader } from "@/components/features/playground/workspace/editor/components/header";
import { WorkspaceEditorFooter } from "@/components/features/playground/workspace/editor/components/footer";

interface CodeLayoutProps {
  children: React.ReactNode;
}

export default function CodeLayout({ children }: CodeLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <WorkspaceEditorHeader className="border-b border-x border-muted bg-background" />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
      <WorkspaceEditorFooter />
    </div>
  );
}
