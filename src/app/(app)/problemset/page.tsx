import { Suspense } from "react";
import {
  ProblemsetTable,
  ProblemsetTableSkeleton,
} from "@/features/problemset/components/table";

export default function ProblemsetPage() {
  return (
    <div className="h-full container mx-auto p-4">
      <Suspense fallback={<ProblemsetTableSkeleton />}>
        <ProblemsetTable />
      </Suspense>
    </div>
  );
}
