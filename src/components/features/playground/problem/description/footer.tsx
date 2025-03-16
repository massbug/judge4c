import { cn } from "@/lib/utils";

interface ProblemDescriptionFooterProps {
  title: string;
  className?: string;
}

export default function ProblemDescriptionFooter({
  title,
  className,
  ...props
}: ProblemDescriptionFooterProps) {
  return (
    <footer
      {...props}
      className={cn("h-9 flex flex-none items-center bg-muted px-3 py-2", className)}
    >
      <div className="w-full flex items-center justify-center">
        <span className="truncate">Description of {title}</span>
      </div>
    </footer>
  );
}
