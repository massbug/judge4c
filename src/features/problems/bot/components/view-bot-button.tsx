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
import { Actions, DockLocation } from "flexlayout-react";
import { useProblemFlexLayoutStore } from "@/stores/problem-flexlayout";

export const ViewBotButton = () => {
  const t = useTranslations();
  const { model } = useProblemFlexLayoutStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBotVisible, setBotVisible] = useState<boolean>(false);

  useEffect(() => {
    if (model) {
      const botTab = model.getNodeById("bot");
      setBotVisible(!!botTab);
      setIsLoading(false);
    }
  }, [model]);

  const handleBotToggle = (newState: boolean) => {
    if (!model) return;

    const botTab = model.getNodeById("bot");

    if (newState) {
      if (botTab) {
        model.doAction(Actions.selectTab("bot"));
      } else {
        model.doAction(
          Actions.addNode(
            {
              type: "tab",
              id: "bot",
              name: "Bot",
              component: "bot",
              enableClose: false,
            },
            model.getRoot().getId(),
            DockLocation.RIGHT,
            -1
          )
        );
      }
    } else {
      if (botTab) {
        model.doAction(Actions.deleteTab("bot"));
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
              aria-label="Toggle Bot"
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
          <p>
            {isBotVisible
              ? t("BotVisibilityToggle.close")
              : t("BotVisibilityToggle.open")}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
