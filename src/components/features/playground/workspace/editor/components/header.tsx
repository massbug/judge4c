import { cn } from "@/lib/utils";
import { EditorLanguage } from "@prisma/client";
import CopyButton from "./copy-button";
import RedoButton from "./redo-button";
import UndoButton from "./undo-button";
import ResetButton from "./reset-button";
import FormatButton from "./format-button";
import LanguageSelector from "./language-selector";

interface WorkspaceEditorHeaderProps {
  templates: { language: EditorLanguage; template: string }[];
  className?: string;
}

export default function WorkspaceEditorHeader({
  templates,
  className,
  ...props
}: WorkspaceEditorHeaderProps) {
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
          <ResetButton templates={templates} />
          <UndoButton />
          <RedoButton />
          <FormatButton />
          <CopyButton />
        </div>
      </div>
    </header>
  );
}
