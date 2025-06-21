"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { useProblemEditorStore } from "@/stores/problem-editor";

let MarkerSeverity: typeof import("monaco-editor").MarkerSeverity;
if (typeof window !== "undefined") {
  import("monaco-editor").then((monaco) => {
    MarkerSeverity = monaco.MarkerSeverity;
  });
}

interface CodeFooterProps {
  className?: string;
}

export const CodeFooter = ({ className }: CodeFooterProps) => {
  const t = useTranslations("WorkspaceEditorFooter");
  const { editor, markers } = useProblemEditorStore();
  const [position, setPosition] = useState<{
    lineNumber: number;
    column: number;
  } | null>(null);

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
      className={cn(
        "h-9 flex flex-none items-center px-3 py-2 bg-muted",
        className
      )}
    >
      <div className="w-full flex items-center justify-between px-0.5 truncate">
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <CircleXIcon
              className="text-red-500"
              size={20}
              aria-hidden="true"
            />
            {markers.filter((m) => m.severity === MarkerSeverity.Error).length}
          </div>
          <div className="flex items-center gap-1.5">
            <TriangleAlertIcon
              className="text-yellow-500"
              size={20}
              aria-hidden="true"
            />
            {
              markers.filter((m) => m.severity === MarkerSeverity.Warning)
                .length
            }
          </div>
        </div>
        <span className="truncate">
          {position
            ? `${t("Row")} ${position.lineNumber}, ${t("Column")} ${
                position.column
              }`
            : `${t("Row")} -, ${t("Column")} -`}
        </span>
      </div>
    </footer>
  );
};
