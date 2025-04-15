"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";

export function ResetButton() {
  const { editor, currentTemplate } = useProblem();
  const t = useTranslations("WorkspaceEditorHeader.ResetButton");

  const handleReset = () => {
    if (editor) {
      const model = editor.getModel();
      if (model) {
        const fullRange = model.getFullModelRange();
        editor.pushUndoStop();
        editor.executeEdits("reset-code", [
          {
            range: fullRange,
            text: currentTemplate,
            forceMoveMarkers: true,
          },
        ]);
        editor.pushUndoStop();
      }
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("TooltipContent")}
            onClick={handleReset}
            disabled={!editor}
            className="h-6 w-6 px-1.5 py-0.5 border-none shadow-none hover:bg-muted"
          >
            <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {t("TooltipContent")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
