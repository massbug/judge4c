import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import BackButton from "@/components/back-button";
import { RunCodeButton } from "@/components/run-code";
import { AvatarButton } from "@/components/avatar-button";
import BotVisibilityToggle from "@/components/bot-visibility-toggle";

interface PlaygroundHeaderProps {
  className?: string;
}

export async function PlaygroundHeader({
  className,
  ...props
}: PlaygroundHeaderProps) {
  const session = await auth();

  return (
    <header
      {...props}
      className={cn("relative", className)}
    >
      <nav className="z-0 relative h-12 w-full flex shrink-0 items-center px-2.5">
        <div className="w-full flex justify-between">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <BackButton href="/problemset" />
            </div>
            <div className="relative flex items-center gap-2">
              <BotVisibilityToggle />
              <AvatarButton />
            </div>
          </div>
        </div>
      </nav>
      <div className="z-10 absolute left-1/2 top-0 h-full -translate-x-1/2 py-2">
        <div className="relative flex">
          <div className="relative flex overflow-hidden rounded">
            <RunCodeButton session={session} className="bg-muted text-muted-foreground hover:bg-muted/50" />
          </div>
        </div>
      </div>
    </header>
  );
}
