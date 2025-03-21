"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";

export function UndoButton() {
  const { editor } = useProblem();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Undo Code"
            onClick={() => {
              editor?.trigger("undo", "undo", null);
            }}
            disabled={!editor}
            className="h-6 w-6 px-1.5 py-0.5 border-none shadow-none hover:bg-muted"
          >
            <Undo2 size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Undo Code
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
