import { Suspense } from "react";
import {
  CodeContent,
  CodeContentSkeleton,
} from "@/features/problems/code/components/content";
import { CodeToolbar } from "@/features/problems/code/components/toolbar/code-toolbar";

interface CodePanelProps {
  problemId: string;
}

export const CodePanel = ({ problemId }: CodePanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-3xl bg-background overflow-hidden">
      <CodeToolbar className="border-b" />
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<CodeContentSkeleton />}>
            <CodeContent problemId={problemId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
