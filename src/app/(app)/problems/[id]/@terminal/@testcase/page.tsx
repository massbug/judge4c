import { RadioIcon } from "lucide-react";

export default function TerminalTestcasePage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center border border-muted rounded-lg p-4 shadow-lg gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <RadioIcon className="opacity-60" size={16} />
        </div>
        <div className="flex grow items-center gap-12">
          <div className="space-y-1">
            <p className="text-sm font-medium">Launching in v0.0.1</p>
            <p className="text-muted-foreground text-xs">
              Expected release date: March 16 at 6:00 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
