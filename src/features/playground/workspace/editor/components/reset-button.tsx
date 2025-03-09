"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorLanguage } from "@prisma/client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

interface ResetButtonProps {
  templates: { language: EditorLanguage; template: string }[];
}

export default function ResetButton({
  templates,
}: ResetButtonProps) {
  const { editor, language } = useCodeEditorStore();

  const currentTemplate = templates.find((t) => t.language === language)?.template ?? "";

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
            }}
            disabled={templates.length === 0}
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
