"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Template } from "@/generated/client";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorStore } from "@/stores/problem-editor-store";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

interface ResetButtonProps {
  templates: Template[];
}

const ResetButton = ({ templates }: ResetButtonProps) => {
  const t = useTranslations("WorkspaceEditorHeader.ResetButton");
  const { language } = useProblemEditorStore();
  const { canExecute, handleReset } = useProblemEditorActions();

  const currentTemplate = useMemo(() => {
    return (
      templates.find((template) => template.language === language)?.template ??
      ""
    );
  }, [language, templates]);

  const handleClick = () => {
    handleReset(currentTemplate);
  };

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      onClick={handleClick}
      aria-label={t("TooltipContent")}
      disabled={!canExecute}
    >
      <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
    </TooltipButton>
  );
};

export { ResetButton };
