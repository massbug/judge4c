"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { optimizeCode } from "@/app/actions/analyze";
import { LoaderCircleIcon, Wand2Icon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorStore } from "@/stores/problem-editor";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

export const OptimizeButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.OptimizeButton");
  const { value, setOptimizedCode } = useProblemEditorStore();
  const { canExecute } = useProblemEditorActions();
  //   const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    // setError(null);
    setIsLoading(true);
    setOptimizedCode("");
    try {
      const optimizedCode = await optimizeCode(value);
      setOptimizedCode(optimizedCode);
    } catch (error) {
      console.error("Error analyzing complexity:", error);
      setOptimizedCode("");
      //   setError(t("Error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      onClick={handleClick}
      disabled={!canExecute || isLoading}
    >
      {isLoading ? (
        <LoaderCircleIcon
          className="opacity-60 animate-spin"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <Wand2Icon size={16} strokeWidth={2} aria-hidden="true" />
      )}
    </TooltipButton>
  );
};
