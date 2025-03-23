"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";

const getLspStatusColor = (webSocket: WebSocket | null) => {
  if (!webSocket) return "bg-gray-500";

  switch (webSocket.readyState) {
    case WebSocket.CONNECTING:
      return "bg-yellow-500";
    case WebSocket.OPEN:
      return "bg-green-500";
    case WebSocket.CLOSING:
      return "bg-orange-500";
    case WebSocket.CLOSED:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function LspStatusButton() {
  const { webSocket } = useProblem();

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
                  webSocket
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
