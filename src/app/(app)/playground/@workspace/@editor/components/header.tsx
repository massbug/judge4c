"use client";

import { cn } from "@/lib/utils";
import CopyButton from "./copy-button";
import RedoButton from "./redo-button";
import UndoButton from "./undo-button";
import ResetButton from "./reset-button";
import FormatButton from "./format-button";
import LanguageSelector from "./language-selector";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { TEMP_DEFAULT_EDITOR_VALUE } from "@/config/problem/value";

interface WorkspaceEditorHeaderProps {
  className?: string;
}

export default function WorkspaceEditorHeader({
  className,
  ...props
}: WorkspaceEditorHeaderProps) {
  const { language } = useCodeEditorStore();

  return (
    <header
      {...props}
      className={cn("h-8 flex flex-none items-center px-2 border-b", className)}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <LanguageSelector />
        </div>
        <div className="flex items-center gap-x-2">
          <ResetButton value={TEMP_DEFAULT_EDITOR_VALUE[language]} />
          <UndoButton />
          <RedoButton />
          <FormatButton />
          <CopyButton />
        </div>
      </div>
    </header>
  );
}
