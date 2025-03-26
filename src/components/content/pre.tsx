"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PreProps {
  children?: ReactNode;
  className?: string;
}

export function Pre({
  children,
  className,
  ...props
}: PreProps) {
  const preRef = useRef<HTMLPreElement>(null);
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

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-2 top-2 size-9 z-10 transition-opacity duration-200",
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
          <CheckIcon className="stroke-emerald-500" size={16} aria-hidden="true" />
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
      <ScrollArea>
        <pre ref={preRef} className={className} {...props}>
          {children}
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
