import { cn } from "@/lib/utils";
import LanguageSelector from "./language-selector";

interface WorkspaceEditorHeaderProps {
  className?: string;
}

export default function WorkspaceEditorHeader({
  className,
  ...props
}: WorkspaceEditorHeaderProps) {
  return (
    <header
      {...props}
      className={cn("h-8 flex flex-none items-center px-2 border-b", className)}
    >
      <div className="w-full flex items-center">
        <div className="flex items-center gap-x-2">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
