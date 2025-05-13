"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

export const ResetButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.ResetButton");
  const { canExecute, handleReset } = useProblemEditorActions();

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      onClick={handleReset}
      aria-label={t("TooltipContent")}
      disabled={!canExecute}
    >
      <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
    </TooltipButton>
  );
};
