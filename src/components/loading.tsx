import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="h-full w-full p-2">
      <Skeleton className="h-full w-full rounded-3xl" />
    </div>
  );
}
