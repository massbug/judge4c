"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import type { MonacoLanguageClient } from "monaco-languageclient";

const getLspStatusColor = (client: MonacoLanguageClient | null) => {
  if (!client) return "bg-amber-500";
  return client.isRunning() ? "bg-emerald-500" : "bg-red-500";
};

export function LspStatusButton() {
  const { monacoLanguageClient } = useProblem();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="h-6 w-auto px-2 py-0 gap-1 border-none shadow-none hover:bg-muted"
          >
            <div className="h-3 w-3 flex items-center justify-center">
              <div
                className={`h-1.5 w-1.5 rounded-full transition-all ${getLspStatusColor(
                  monacoLanguageClient
                )}`}
              />
            </div>
            LSP
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Language Server
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
