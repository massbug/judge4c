import { ProblemEditor } from "@/components/problem-editor";
import { WorkspaceEditorHeader } from "@/components/features/playground/workspace/editor/components/header";
import { WorkspaceEditorFooter } from "@/components/features/playground/workspace/editor/components/footer";

export default function CodePage() {
  return (
    <div className="flex flex-col h-full">
      <WorkspaceEditorHeader className="border-b border-x border-muted bg-background" />
      <div className="relative flex-1 border-x border-muted">
        <div className="absolute w-full h-full">
          <ProblemEditor />
        </div>
      </div>
      <WorkspaceEditorFooter />
    </div>
  );
}
