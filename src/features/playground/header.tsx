import { cn } from "@/lib/utils";
import RunCode from "@/components/run-code";
import BackButton from "@/components/back-button";
import SettingsButton from "@/components/settings-button";
import { SettingsDialog } from "@/components/settings-dialog";

interface PlaygroundHeaderProps {
  className?: string;
}

export function PlaygroundHeader({
  className,
  ...props
}: PlaygroundHeaderProps) {
  return (
    <header
      {...props}
      className={cn("relative", className)}
    >
      <nav className="relative h-12 w-full flex shrink-0 items-center px-2.5">
        <div className="w-full flex justify-between">
          <div className="w-full flex items-center justify-between">
            <div className="z-10 flex items-center">
              <BackButton href="/problemset" />
            </div>
            <div className="z-10 flex items-center gap-2">
              <SettingsButton />
            </div>
          </div>
        </div>
      </nav>
      <div className="absolute left-0 right-0 top-0 h-full mx-auto py-2">
        <div className="relative flex justify-center">
          <div className="relative flex overflow-hidden rounded">
            <RunCode className="bg-muted text-muted-foreground hover:bg-muted/50" />
          </div>
        </div>
      </div>
      <SettingsDialog />
    </header>
  );
}
