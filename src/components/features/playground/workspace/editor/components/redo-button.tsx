"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Redo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";

export function RedoButton() {
  const { editor } = useProblem();
  const t = useTranslations("WorkspaceEditorHeader.RedoButton");

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("TooltipContent")}
            onClick={() => {
              editor?.trigger("redo", "redo", null);
            }}
            disabled={!editor}
            className="h-6 w-6 px-1.5 py-0.5 border-none shadow-none hover:bg-muted"
          >
            <Redo2 size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {t("TooltipContent")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
