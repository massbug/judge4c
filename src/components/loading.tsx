import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  className?: string;
  skeletonClassName?: string;
}

export function Loading({
  className,
  skeletonClassName,
  ...props
}: LoadingProps) {
  return (
    <div className={cn("h-full w-full p-2", className)} {...props}>
      <Skeleton className={cn("h-full w-full rounded-3xl", skeletonClassName)} />
    </div>
  );
}
