"use client";

import { Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

const UndoButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.UndoButton");
  const { canExecute, handleUndo } = useProblemEditorActions();

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      onClick={handleUndo}
      aria-label={t("TooltipContent")}
      disabled={!canExecute}
    >
      <Undo2 size={16} strokeWidth={2} aria-hidden="true" />
    </TooltipButton>
  );
};

export { UndoButton };
