import { Suspense } from "react";
import {
  TestcaseContent,
  TestcaseContentSkeleton,
} from "@/features/problems/testcase/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";

interface TestcasePanelProps {
  problemId: string;
}

export const TestcasePanel = ({ problemId }: TestcasePanelProps) => {
  return (
    <PanelLayout>
      <Suspense fallback={<TestcaseContentSkeleton />}>
        <TestcaseContent problemId={problemId} />
      </Suspense>
    </PanelLayout>
  );
};
