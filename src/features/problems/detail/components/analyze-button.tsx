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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { analyzeComplexity } from "@/app/actions/analyze";
import { AnalyzeComplexityResponse } from "@/types/complexity";
import { LoaderCircleIcon, WandSparklesIcon } from "lucide-react";

interface AnalyzeButtonProps {
  value: string;
}

export const AnalyzeButton = ({ value }: AnalyzeButtonProps) => {
  const t = useTranslations("WorkspaceEditorHeader.AnalyzeButton");
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
      <Button variant="ghost" disabled={isLoading} onClick={handleClick}>
        {isLoading ? (
          <LoaderCircleIcon
            className="opacity-60 animate-spin"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <WandSparklesIcon size={16} aria-hidden="true" />
        )}
        <Label>{isLoading ? t("Analyzing") : t("ComplexityAnalysis")}</Label>
      </Button>
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
