"use client";

import { useTranslations } from "next-intl";
import { CodeXmlIcon, GitCompareIcon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const ViewToggleButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.ViewToggleButton");
  const { showDiffView, toggleView } = useProblemEditorStore();

  return (
    <TooltipButton
      tooltipContent={showDiffView ? t("ShowCodeView") : t("ShowDiffView")}
      onClick={toggleView}
    >
      {showDiffView ? (
        <CodeXmlIcon size={16} strokeWidth={2} aria-hidden="true" />
      ) : (
        <GitCompareIcon size={16} strokeWidth={2} aria-hidden="true" />
      )}
    </TooltipButton>
  );
};
