import { cn } from "@/lib/utils";
import RunCode from "./run-code";
import SettingsButton from "./settings-button";

interface HeaderProps {
  className?: string;
}

export function Header({
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      {...props}
      className={cn("relative", className)}
    >
      <nav className="relative h-12 w-full flex shrink-0 items-center px-2.5">
        <div className="w-full flex justify-between">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center"></div>
            <div className="relative flex items-center gap-2">
              <SettingsButton />
            </div>
          </div>
        </div>
      </nav>
      <div className="z-10 absolute left-1/2 top-0 h-full -translate-x-1/2 py-2">
        <div className="relative flex">
          <div className="relative flex overflow-hidden rounded">
            <RunCode />
          </div>
        </div>
      </div>
    </header>
  );
}
