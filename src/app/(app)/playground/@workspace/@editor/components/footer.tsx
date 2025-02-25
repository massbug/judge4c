"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCodeEditorState } from "@/store/useCodeEditor";

interface WorkspaceEditorFooterProps {
  className?: string;
}

export default function WorkspaceEditorFooter({ className, ...props }: WorkspaceEditorFooterProps) {
  const { editor } = useCodeEditorState();
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
    <footer {...props} className={cn("h-9 flex-none bg-muted px-3 py-2", className)}>
      <div className="flex justify-end">
        {position ? `Row ${position.lineNumber}, Column ${position.column}` : "Row -, Column -"}
      </div>
    </footer>
  );
}
