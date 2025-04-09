import TestcaseCard from "@/components/testcase-card";
import { useProblemStore } from "@/providers/problem-store-provider";

export default function Testcase() {
  const problem = useProblemStore((state) => state.problem);

  return (
    <div className="h-full rounded-b-3xl border border-t-0 border-muted bg-background">
      <TestcaseCard testcases={problem.testcases} />
    </div>
  );
}
