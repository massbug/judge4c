"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";

interface SettingsButtonProps {
  className?: string;
}

export default function SettingsButton({
  className,
  ...props
}: SettingsButtonProps) {
  const { setDialogOpen } = useSettingsStore();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn("h-8 w-auto p-2", className)}
            onClick={() => setDialogOpen(true)}
            {...props}
          >
            <SettingsIcon size={16} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
