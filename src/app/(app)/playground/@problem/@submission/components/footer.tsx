import { cn } from "@/lib/utils";

interface ProblemSubmissionFooterProps {
  className?: string;
}

export default function ProblemSubmissionFooter({
  className,
  ...props
}: ProblemSubmissionFooterProps) {
  return (
    <footer
      {...props}
      className={cn(
        "h-9 flex flex-none items-center bg-muted px-3 py-2",
        className
      )}
    >
      <div className="w-full flex items-center justify-center">
        <span className="truncate">Submission of Two Sum</span>
      </div>
    </footer>
  );
}
