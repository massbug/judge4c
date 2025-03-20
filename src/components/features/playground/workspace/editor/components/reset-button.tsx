"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProblemEditor } from "@/hooks/use-problem-editor";

export function ResetButton() {
  const { editor, currentTemplate } = useProblemEditor();

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
            aria-label="Reset Code"
            onClick={handleReset}
            disabled={!editor}
            className="h-6 w-6 px-1.5 py-0.5 border-none shadow-none hover:bg-muted"
          >
            <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Reset Code
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
