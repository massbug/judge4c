import { ProblemEditor } from "@/components/problem-editor";
import { WorkspaceEditorHeader } from "@/components/features/playground/workspace/editor/components/header";
import { WorkspaceEditorFooter } from "@/components/features/playground/workspace/editor/components/footer";

export default function WorkspaceEditorPage() {
  return (
    <>
      <WorkspaceEditorHeader />
      <div className="flex-1">
        <ProblemEditor />
      </div>
      <WorkspaceEditorFooter />
    </>
  );
}
