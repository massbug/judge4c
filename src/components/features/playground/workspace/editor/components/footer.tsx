"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MarkerSeverity } from "monaco-editor";
import { useProblem } from "@/hooks/use-problem";
import { CircleXIcon, TriangleAlertIcon } from "lucide-react";

interface WorkspaceEditorFooterProps {
  className?: string;
}

export function WorkspaceEditorFooter({
  className,
  ...props
}: WorkspaceEditorFooterProps) {
  const { editor, markers } = useProblem();
  const [position, setPosition] = useState<{ lineNumber: number; column: number } | null>(null);

  useEffect(() => {
    if (!editor) return;

    const initialPosition = editor.getPosition();
    if (initialPosition) {
      setPosition({
        lineNumber: initialPosition.lineNumber,
        column: initialPosition.column,
      });
    }

    const dispose = editor.onDidChangeCursorPosition((e) => {
      setPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });

    return () => dispose.dispose();
  }, [editor]);

  return (
    <footer
      {...props}
      className={cn("h-9 flex flex-none items-center px-3 py-2 bg-muted", className)}
    >
      <div className="w-full flex items-center justify-between px-0.5 truncate">
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <CircleXIcon className="text-red-500" size={20} aria-hidden="true" />
            {markers.filter((m) => m.severity === MarkerSeverity.Error).length}
          </div>
          <div className="flex items-center gap-1.5">
            <TriangleAlertIcon className="text-yellow-500" size={20} aria-hidden="true" />
            {markers.filter((m) => m.severity === MarkerSeverity.Warning).length}
          </div>
        </div>
        <span className="truncate">
          {position
            ? `Row ${position.lineNumber}, Column ${position.column}`
            : "Row -, Column -"}
        </span>
      </div>
    </footer>
  );
}
