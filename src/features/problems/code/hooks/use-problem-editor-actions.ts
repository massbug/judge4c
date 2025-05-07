import { useCallback } from "react";
import { useProblemEditorStore } from "@/stores/problem-editor-store";

export const useProblemEditorActions = () => {
  const { editor } = useProblemEditorStore();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editor?.getValue() || "");
      return true;
    } catch (error) {
      console.error("Failed to copy text: ", error);
      return false;
    }
  }, [editor]);

  const handleFormat = useCallback(() => {
    editor?.trigger("format", "editor.action.formatDocument", null);
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor?.trigger("undo", "undo", null);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor?.trigger("redo", "redo", null);
  }, [editor]);

  const handleReset = useCallback((template: string) => {
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    const fullRange = model.getFullModelRange();
    editor.pushUndoStop();
    editor.executeEdits("reset-code", [
      {
        range: fullRange,
        text: template,
        forceMoveMarkers: true,
      },
    ]);
    editor.pushUndoStop();
  }, [editor]);

  return {
    handleCopy,
    handleFormat,
    handleUndo,
    handleRedo,
    handleReset,
    canExecute: !!editor,
  };
};
