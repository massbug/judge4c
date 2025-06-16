"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Toggle } from "@/components/ui/toggle";
import { useProblemDockviewStore } from "@/stores/problem-dockview";

export default function BotVisibilityToggle() {
  const { api } = useProblemDockviewStore();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBotVisible, setBotVisible] = useState<boolean>(false);

  useEffect(() => {
    if (api) {
      const panel = api.getPanel("Bot");
      setBotVisible(!!panel);
      setIsLoading(false);
    }
  }, [api]);

  const handleBotToggle = (newState: boolean) => {
    if (!api) return;

    const panel = api.getPanel("Bot");

    if (newState) {
      if (panel) {
        panel.api.setActive();
      } else {
        api.addPanel({
          id: "Bot",
          component: "Bot",
          tabComponent: "Bot",
          title: t("ProblemPage.Bot"),
          position: {
            direction: "right",
          },
        });
      }
    } else {
      if (panel) {
        api.removePanel(panel);
      }
    }

    setBotVisible(newState);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Toggle
              aria-label="Toggle bot"
              pressed={isBotVisible}
              onPressedChange={handleBotToggle}
              size="sm"
              className="rounded-lg"
              disabled={isLoading}
            >
              <BotIcon size={16} aria-hidden="true" />
            </Toggle>
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          <p>{isBotVisible ? t("BotVisibilityToggle.close") : t("BotVisibilityToggle.open")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
