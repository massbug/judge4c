import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  className?: string;
}

export function Loading({
  className,
  ...props
}: LoadingProps) {
  return (
    <div className={cn("h-full w-full p-2", className)} {...props}>
      <Skeleton className="h-full w-full rounded-3xl" />
    </div>
  );
}
