"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { judge } from "@/app/actions/judge";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import { useCodeEditorState } from "@/store/useCodeEditor";

interface RunCodeProps {
  className?: string;
}

export default function RunCode({
  className,
  ...props
}: RunCodeProps) {
  const { language, editor } = useCodeEditorState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJudge = async () => {
    if (!editor) return;

    const code = editor.getValue() || "";
    setIsLoading(true);

    try {
      const judgeResult = await judge(language, code);
      console.log(judgeResult);
    } catch (error) {
      console.error("Error occurred while judging the code:");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
