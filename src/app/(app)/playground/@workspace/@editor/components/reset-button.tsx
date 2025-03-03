"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_EDITOR_VALUE } from "@/config/editor/value";

export default function ResetButton() {
  const { editor, language } = useCodeEditorStore();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset Code"
            onClick={() => {
              if (editor) {
                const value = DEFAULT_EDITOR_VALUE[language];
                const model = editor.getModel();
                if (model) {
                  const fullRange = model.getFullModelRange();
                  editor.executeEdits("reset-code", [
                    {
                      range: fullRange,
                      text: value,
                      forceMoveMarkers: true,
                    },
                  ]);
                }
              }
            }}
            className="h-6 w-6 px-1.5 py-0.5 border-none hover:bg-muted"
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
