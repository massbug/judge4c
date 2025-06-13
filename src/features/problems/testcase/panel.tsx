import { Suspense } from "react";
import {
  TestcaseContent,
  TestcaseContentSkeleton,
} from "@/features/problems/testcase/content";

interface TestcasePanelProps {
  problemId: string;
}

export const TestcasePanel = ({ problemId }: TestcasePanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<TestcaseContentSkeleton />}>
            <TestcaseContent problemId={problemId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
