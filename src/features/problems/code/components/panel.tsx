import { Suspense } from "react";
import {
  CodeContent,
  CodeContentSkeleton,
} from "@/features/problems/code/components/content";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";
import { CodeFooter } from "@/features/problems/code/components/footer";
import { CodeToolbar } from "@/features/problems/code/components/toolbar/code-toolbar";

interface CodePanelProps {
  problemId: string;
}

export const CodePanel = ({ problemId }: CodePanelProps) => {
  return (
    <PanelLayout isScroll={false}>
      <div className="h-full flex flex-col">
        <CodeToolbar className="border-b" />
        <Suspense fallback={<CodeContentSkeleton />}>
          <CodeContent problemId={problemId} />
        </Suspense>
        <CodeFooter />
      </div>
    </PanelLayout>
  );
};
