"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { judge } from "@/app/actions/judge";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface RunCodeProps {
  className?: string;
}

export default function RunCode({
  className,
  ...props
}: RunCodeProps) {
  const { language, editor, setResult } = useCodeEditorStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJudge = async () => {
    if (!editor) return;

    const code = editor.getValue() || "";
    setIsLoading(true);

    try {
      const result = await judge(language, code);
      setResult(result);
    } catch (error) {
      console.error("Error occurred while judging the code:");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            variant="secondary"
            className={cn("h-8 px-3 py-1.5", className)}
            onClick={handleJudge}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircleIcon
                className="-ms-1 opacity-60 animate-spin"
                size={16}
                aria-hidden="true"
              />
            ) : (
              <PlayIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
            )}
            {isLoading ? "Running..." : "Run"}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">Run Code</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
