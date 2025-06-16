import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  className?: string;
  skeletonClassName?: string;
}

const Loading = ({ className, skeletonClassName }: LoadingProps) => {
  return (
    <div className={cn("h-full w-full p-2 bg-background", className)}>
      <Skeleton
        className={cn("h-full w-full rounded-3xl", skeletonClassName)}
      />
    </div>
  );
};

export { Loading };
