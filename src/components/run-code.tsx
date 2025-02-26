import { cn } from "@/lib/utils";
import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RunCodeProps {
  className?: string;
}

export default function RunCode({
  className,
  ...props
}: RunCodeProps) {
  return (
    <Button
      {...props}
      variant="secondary"
      className={cn("h-8 px-3 py-1.5", className)}
    >
      <PlayIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
      Run
    </Button>
  );
}
