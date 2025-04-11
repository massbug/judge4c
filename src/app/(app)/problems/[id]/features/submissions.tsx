"use client";

import SubmissionsTable from "@/components/submissions-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useProblemStore } from "@/providers/problem-store-provider";

export default function Submissions() {
  const submissions = useProblemStore((state) => state.submissions);

  return (
    <div className="px-3 flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <ScrollArea className="h-full">
        <SubmissionsTable submissions={submissions} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
