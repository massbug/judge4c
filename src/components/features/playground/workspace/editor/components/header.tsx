import { cn } from "@/lib/utils";
import CopyButton from "./copy-button";
import RedoButton from "./redo-button";
import UndoButton from "./undo-button";
import ResetButton from "./reset-button";
import FormatButton from "./format-button";
import LanguageSelector from "./language-selector";
import { EditorLanguage, EditorLanguageConfig, LanguageServerConfig } from "@prisma/client";

interface WorkspaceEditorHeaderProps {
  templates: { language: EditorLanguage; template: string }[];
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
  className?: string;
}

export default function WorkspaceEditorHeader({
  templates,
  editorLanguageConfigs,
  languageServerConfigs,
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
          <LanguageSelector
            editorLanguageConfigs={editorLanguageConfigs}
            languageServerConfigs={languageServerConfigs}
          />
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
