"use client";

import { Paintbrush } from "lucide-react";
import { useTranslations } from "next-intl";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

const FormatButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.FormatButton");
  const { canExecute, handleFormat } = useProblemEditorActions();

  return (
    <TooltipButton
      onClick={handleFormat}
      aria-label={t("TooltipContent")}
      disabled={!canExecute}
      tooltipContent={t("TooltipContent")}
    >
      <Paintbrush size={16} strokeWidth={2} aria-hidden="true" />
    </TooltipButton>
  );
};

export { FormatButton };
