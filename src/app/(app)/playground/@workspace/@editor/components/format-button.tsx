"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodeEditorState } from "@/store/useCodeEditor";

export default function FormatButton() {
  const { editor } = useCodeEditorState();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Format Code"
            onClick={() => {
              editor?.trigger("format", "editor.action.formatDocument", null);
            }}
            className="h-6 w-6 px-1.5 py-0.5 border-none hover:bg-muted"
          >
            <Paintbrush size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Format Code
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
