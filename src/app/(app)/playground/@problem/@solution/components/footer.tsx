import { cn } from "@/lib/utils";

interface ProblemSolutionFooterProps {
  className?: string;
}

export default function ProblemSolutionFooter({
  className,
  ...props
}: ProblemSolutionFooterProps) {
  return (
    <footer
      {...props}
      className={cn("h-9 flex flex-none items-center bg-muted", className)}
    >
      <div className="w-full flex items-center justify-center">
        <span className="truncate">
          Solution of Two Sum
        </span>
      </div>
    </footer>
  );
}
