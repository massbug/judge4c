"use client";

import { cn } from "@/lib/utils";
import {
  CopyButton,
  FormatButton,
  LanguageSelector,
  RedoButton,
  ResetButton,
  UndoButton,
} from "@/features/problems/code/components/toolbar";
import { useProblemEditorStore } from "@/stores/problem-editor";
import { AnalyzeButton } from "@/features/problems/code/components/toolbar/actions/analyze-button";
import { OptimizeButton } from "@/features/problems/code/components/toolbar/actions/optimize-button";
import { ViewToggleButton } from "@/features/problems/code/components/toolbar/actions/view-toggle-button";
import { LspConnectionIndicator } from "@/features/problems/code/components/toolbar/controls/lsp-connection-indicator";

interface CodeToolbarProps {
  className?: string;
}

export const CodeToolbar = ({ className }: CodeToolbarProps) => {
  const { optimizedCode } = useProblemEditorStore();

  return (
    <header
      className={cn("relative flex h-8 flex-none items-center", className)}
    >
      <div className="absolute flex w-full items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <LspConnectionIndicator />
        </div>
        <div className="flex items-center gap-2">
          {optimizedCode && <ViewToggleButton />}
          <OptimizeButton />
          <AnalyzeButton />
          <ResetButton />
          <UndoButton />
          <RedoButton />
          <FormatButton />
          <CopyButton />
        </div>
      </div>
    </header>
  );
};
