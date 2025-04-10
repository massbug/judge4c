import TestcaseCard from "@/components/testcase-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProblemStore } from "@/providers/problem-store-provider";

export default function Testcase() {
  const problem = useProblemStore((state) => state.problem);

  return (
    <div className="relative h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <div className="absolute h-full w-full">
        <ScrollArea className="h-full">
          <TestcaseCard testcases={problem.testcases} />
        </ScrollArea>
      </div>
    </div>
  );
}
