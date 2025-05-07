"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorActions } from "@/features/problems/code/hooks/use-problem-editor-actions";

const CopyButton = () => {
  const t = useTranslations("WorkspaceEditorHeader.CopyButton");
  const [copied, setCopied] = useState(false);
  const { canExecute, handleCopy } = useProblemEditorActions();

  const handleClick = async () => {
    const success = await handleCopy();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <TooltipButton
      tooltipContent={t("TooltipContent")}
      onClick={handleClick}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      disabled={!canExecute || copied}
      className={copied ? "disabled:opacity-100" : undefined}
    >
      <div
        className={cn(
          "transition-all",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check
          className="stroke-emerald-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
      <div
        className={cn(
          "absolute transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Copy size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </TooltipButton>
  );
};

export { CopyButton };
