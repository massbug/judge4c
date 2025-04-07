import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { RedoButton } from "./redo-button";
import { UndoButton } from "./undo-button";
import { ResetButton } from "./reset-button";
import { FormatButton } from "./format-button";
import { LspStatusButton } from "./lsp-status-button";
import { LanguageSelector } from "./language-selector";

interface WorkspaceEditorHeaderProps {
  className?: string;
}

export function WorkspaceEditorHeader({
  className,
  ...props
}: WorkspaceEditorHeaderProps) {
  return (
    <header
      {...props}
      className={cn("flex items-center flex-none h-8 relative", className)}
    >
      <div className="absolute flex w-full items-center justify-between px-2">
        <div className="flex items-center">
          <LanguageSelector />
          <LspStatusButton />
        </div>
        <div className="flex items-center gap-x-2">
          <ResetButton />
          <UndoButton />
          <RedoButton />
          <FormatButton />
          <CopyButton />
        </div>
      </div>
    </header>
  );
}
