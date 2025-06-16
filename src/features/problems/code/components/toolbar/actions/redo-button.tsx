"use client";

import { Redo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

export const RedoButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.RedoButton");
  const { canExecute, handleRedo } = useProblemEditorActions();

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      onClick={handleRedo}
      aria-label={t("TooltipContent")}
      disabled={!canExecute}
    >
      <Redo2 size={16} strokeWidth={2} aria-hidden="true" />
    </TooltipButton>
  );
};
