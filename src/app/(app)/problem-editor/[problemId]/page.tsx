"use client";

import { ProblemFlexLayout } from "@/features/problems/components/problem-flexlayout";
import { EditDescriptionPanel } from "@/components/creater/edit-description-panel";
import { EditSolutionPanel } from "@/components/creater/edit-solution-panel";
import { EditTestcasePanel } from "@/components/creater/edit-testcase-panel";
import { EditDetailPanel } from "@/components/creater/edit-detail-panel";
import { EditCodePanel } from "@/components/creater/edit-code-panel";

interface ProblemEditorPageProps {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemEditorPage({
  params,
}: ProblemEditorPageProps) {
  const { problemId } = await params;

  const components: Record<string, React.ReactNode> = {
    description: <EditDescriptionPanel problemId={problemId} />,
    solution: <EditSolutionPanel problemId={problemId} />,
    detail: <EditDetailPanel problemId={problemId} />,
    code: <EditCodePanel problemId={problemId} />,
    testcase: <EditTestcasePanel problemId={problemId} />,
  };

  return (
    <div className="relative flex h-full w-full">
      <ProblemFlexLayout components={components} />
    </div>
  );
}