"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { judge } from "@/app/actions/judge";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorStore } from "@/stores/problem-editor";
import { useProblemDockviewStore } from "@/stores/problem-dockview";
import { JudgeToast } from "@/features/problems/components/judge-toast";

interface JudgeButtonProps {
  className?: string;
}

export const JudgeButton = ({ className }: JudgeButtonProps) => {
  const { api } = useProblemDockviewStore();
  const { problem, language, value } = useProblemEditorStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("PlaygroundHeader.RunCodeButton");

  const handleJudge = async () => {
    if (!problem?.problemId) return;
    setIsLoading(true);

    const status = await judge(problem.problemId, language, value);
    toast.custom((t) => <JudgeToast t={t} status={status} />);

    const panel = api?.getPanel("submission");
    if (panel && !panel.api.isActive) {
      panel.api.setActive();
    }
    setIsLoading(false);
  };

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      variant="secondary"
      className={cn(
        "h-8 w-auto px-3 py-1.5 bg-muted hover:bg-muted/80",
        className
      )}
      onClick={handleJudge}
      disabled={
        isLoading || !problem?.problemId || !api?.getPanel("submission")
      }
    >
      {isLoading ? (
        <LoaderCircleIcon
          className="-ms-1 opacity-60 animate-spin"
          size={16}
          aria-hidden="true"
        />
      ) : (
        <PlayIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
      )}
      {isLoading ? t("TooltipTrigger.loading") : t("TooltipTrigger.ready")}
    </TooltipButton>
  );
};
