import { useCallback } from "react";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const useProblemEditorActions = () => {
  const { editor, problem, language } = useProblemEditorStore();

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

  const handleReset = useCallback(() => {
    if (!editor || !problem) return;

    const model = editor.getModel();
    if (!model) return;

    const template =
      problem.templates.find((t) => t.language === language)?.content ?? "";

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
  }, [editor, language, problem]);

  return {
    handleCopy,
    handleFormat,
    handleUndo,
    handleRedo,
    handleReset,
    canExecute: !!editor,
  };
};
