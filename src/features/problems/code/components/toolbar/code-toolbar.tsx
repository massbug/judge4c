import { cn } from "@/lib/utils";
import {
  CopyButton,
  FormatButton,
  LanguageSelector,
  RedoButton,
  ResetButton,
  UndoButton,
} from "@/features/problems/code/components/toolbar";

interface CodeToolbarProps {
  className?: string;
}

export const CodeToolbar = async ({ className }: CodeToolbarProps) => {
  return (
    <header
      className={cn("relative flex h-8 flex-none items-center", className)}
    >
      <div className="absolute flex w-full items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <LanguageSelector />
        </div>
        <div className="flex items-center gap-2">
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
