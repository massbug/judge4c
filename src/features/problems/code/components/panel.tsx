import { Suspense } from "react";
import {
  CodeContent,
  CodeContentSkeleton,
} from "@/features/problems/code/components/content";
import { CodeFooter } from "@/features/problems/code/components/footer";
import { CodeToolbar } from "@/features/problems/code/components/toolbar/code-toolbar";

interface CodePanelProps {
  problemId: string;
}

export const CodePanel = ({ problemId }: CodePanelProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <CodeToolbar className="border-b" />
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          <Suspense fallback={<CodeContentSkeleton />}>
            <CodeContent problemId={problemId} />
          </Suspense>
        </div>
      </div>
      <CodeFooter />
    </div>
  );
};
