"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useDockviewStore } from "@/stores/dockview";
import { DefaultDockviewOptions } from "@/config/dockview";

export default function BotVisibilityToggle() {
  const { api } = useDockviewStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBotVisible, setBotVisible] = useState<boolean>(false);

  const botOption = DefaultDockviewOptions.find(
    (option) => option.id === "Bot"
  );

  useEffect(() => {
    if (api) {
      const panel = api.getPanel("Bot");
      setBotVisible(!!panel);
      setIsLoading(false);
    }
  }, [api]);

  const handleBotToggle = (newState: boolean) => {
    setBotVisible(newState);
    if (!api) return;

    const panel = api.getPanel("Bot");

    if (newState) {
      if (panel) {
        panel.api.setActive();
      } else if (botOption) {
        api.addPanel(botOption).api.setActive();
      }
    } else {
      if (panel) {
        api.removePanel(panel);
      }
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded-lg" />
            ) : (
              <Toggle
                aria-label="Toggle bot"
                pressed={isBotVisible}
                onPressedChange={handleBotToggle}
                size="sm"
                className="rounded-lg"
              >
                <BotIcon size={16} aria-hidden="true" />
              </Toggle>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          <p>{isBotVisible ? "Close Bot" : "Open Bot"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
