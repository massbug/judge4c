"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { analyzeComplexity } from "@/app/actions/analyze";
import { TooltipButton } from "@/components/tooltip-button";
import { ChartBarIcon, LoaderCircleIcon } from "lucide-react";
import { AnalyzeComplexityResponse } from "@/types/complexity";
import { useProblemEditorStore } from "@/stores/problem-editor";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

export const AnalyzeButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.AnalyzeButton");
  const { value } = useProblemEditorStore();
  const { canExecute } = useProblemEditorActions();

  const [open, setOpen] = useState(false);
  const [complexity, setComplexity] =
    useState<AnalyzeComplexityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const complexity = await analyzeComplexity(value);
      setComplexity(complexity);
      setOpen(true);
    } catch (error) {
      console.error("Error analyzing complexity:", error);
      setComplexity(null);
      setError(t("Error"));
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          <ChartBarIcon size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </TooltipButton>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center pb-1.5">
              {t("ComplexityAnalysis")}
            </DialogTitle>
            <DialogDescription className="flex items-center justify-center pt-2">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <span className="h-full flex flex-col gap-2">
                  <span>
                    {t("TimeComplexity")} <strong>{complexity?.time}</strong>
                  </span>
                  <span>
                    {t("SpaceComplexity")} <strong>{complexity?.space}</strong>
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
