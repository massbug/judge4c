"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReactNode, useRef, useState } from "react";
import { CheckIcon, CopyIcon, RepeatIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useProblemEditorStore } from "@/stores/problem-editor";
import { useProblemFlexLayoutStore } from "@/stores/problem-flexlayout";
import { Actions } from "flexlayout-react";

interface PreDetailProps {
  children?: ReactNode;
  className?: string;
}

export const PreDetail = ({
  children,
  className,
  ...props
}: PreDetailProps) => {
  const preRef = useRef<HTMLPreElement>(null);
  const { setValue } = useProblemEditorStore();
  const { model } = useProblemFlexLayoutStore();
  const [copied, setCopied] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const handleCopy = async () => {
    const code = preRef.current?.textContent;
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const handleCopyToEditor = () => {
    const code = preRef.current?.textContent;
    if (code) {
      setValue(code);
    }
    if (model) {
      model.doAction(Actions.selectTab("code"));
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute right-2 top-2 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "size-9 transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-50"
          )}
          disabled={!preRef.current?.textContent || !model}
          onClick={handleCopyToEditor}
          aria-label="New action"
        >
          <RepeatIcon size={16} aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "size-9 transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-50",
            "disabled:opacity-100"
          )}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
          disabled={copied}
        >
          <div
            className={cn(
              "transition-all",
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          >
            <CheckIcon
              className="stroke-emerald-500"
              size={16}
              aria-hidden="true"
            />
          </div>
          <div
            className={cn(
              "absolute transition-all",
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <CopyIcon size={16} aria-hidden="true" />
          </div>
        </Button>
      </div>
      <ScrollArea>
        <pre ref={preRef} className={className} {...props}>
          {children}
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
