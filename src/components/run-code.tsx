"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { judge } from "@/actions/judge";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import { showStatusToast } from "@/hooks/show-status-toast";
import { useTranslations } from "next-intl";

const t = useTranslations('run-code');

interface RunCodeProps {
  className?: string;
}

export function RunCode({
  className,
  ...props
}: RunCodeProps) {
  const { currentLang, editor, problemId } = useProblem();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJudge = async () => {
    if (!editor) return;

    const code = editor.getValue() || "";
    setIsLoading(true);

    try {
      const result = await judge(currentLang, code, problemId);
      showStatusToast({ status: result.status });
    } catch (error) {
      console.error("Error occurred while judging the code:");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            variant="secondary"
            className={cn("h-8 px-3 py-1.5", className)}
            onClick={handleJudge}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircleIcon
                className="-ms-1 opacity-60 animate-spin"
                size={16}
                aria-hidden="true"
              />
            ) : (
              <PlayIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
            )}
            {isLoading ? t('running') : t('run')}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">{t('run-code')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
