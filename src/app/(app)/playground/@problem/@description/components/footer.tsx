import { cn } from "@/lib/utils";

interface ProblemDescriptionFooterProps {
  className?: string;
}

export default function ProblemDescriptionFooter({
  className,
  ...props
}: ProblemDescriptionFooterProps) {
  return (
    <footer
      {...props}
      className={cn("h-9 flex flex-none items-center bg-muted", className)}
    >
      <div className="w-full flex items-center justify-center">
        Description of Two Sum
      </div>
    </footer>
  );
}
