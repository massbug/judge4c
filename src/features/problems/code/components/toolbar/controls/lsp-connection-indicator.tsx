"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getColorClassForLspStatus } from "@/config/status";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const LspConnectionIndicator = () => {
  const { lspWebSocket } = useProblemEditorStore();

  return (
    <Button
      variant="outline"
      className="h-6 w-auto px-2 py-0 gap-1 border-none shadow-none hover:bg-muted"
    >
      <div className="h-3 w-3 flex items-center justify-center">
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-all",
            getColorClassForLspStatus(lspWebSocket)
          )}
        />
      </div>
      <span>LSP</span>
    </Button>
  );
};
