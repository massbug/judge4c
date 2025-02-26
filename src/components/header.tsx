import { cn } from "@/lib/utils";
import RunCode from "./run-code";

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
      className={cn("h-12 flex flex-none items-center justify-center", className)}
    >
      <RunCode />
    </header>
  );
}
