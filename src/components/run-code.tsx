"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Session } from "next-auth";
import { judge } from "@/actions/randomjudge";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import { useDockviewStore } from "@/stores/dockview";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import { showStatusToast } from "@/hooks/show-status-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RunCodeButtonProps {
  className?: string;
  session: Session | null;
}

export function RunCodeButton({
  className,
  session,
}: RunCodeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { api } = useDockviewStore();
  const { currentLang, editor, problemId } = useProblem();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("PlaygroundHeader.RunCodeButton");

  const handleJudge = async () => {
    if (!editor) return;

    const code = editor.getValue() || "";
    setIsLoading(true);

    if (!session) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("redirectTo", pathname);
      router.push(`/sign-in?${params.toString()}`);
    } else {
      try {
        const result = await judge(currentLang, code, problemId);
        showStatusToast({ status: result.status });
        const panel = api?.getPanel("Submissions");
        if (panel && !panel.api.isActive) {
          panel.api.setActive();
        }
      } catch (error) {
        console.error("Error occurred while judging the code:");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className={cn("h-8 px-3 py-1.5", className)}
            onClick={handleJudge}
            disabled={isLoading || !api?.getPanel("Submissions")}
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
            {isLoading ? t("TooltipTrigger.loading") : t("TooltipTrigger.ready")}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {t("TooltipContent")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
