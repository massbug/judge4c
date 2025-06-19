import EditCodePanel from "@/components/creater/edit-code-panel";
import EditDetailPanel from "@/components/creater/edit-detail-panel";
import EditSolutionPanel from "@/components/creater/edit-solution-panel";
import EditTestcasePanel from "@/components/creater/edit-testcase-panel";
import EditDescriptionPanel from "@/components/creater/edit-description-panel";
import { ProblemEditFlexLayout } from "@/features/admin/ui/components/problem-edit-flexlayout";

interface ProblemEditViewProps {
  problemId: string;
}

export const ProblemEditView = ({ problemId }: ProblemEditViewProps) => {
  const components: Record<string, React.ReactNode> = {
    description: <EditDescriptionPanel problemId={problemId} />,
    solution: <EditSolutionPanel problemId={problemId} />,
    detail: <EditDetailPanel problemId={problemId} />,
    code: <EditCodePanel problemId={problemId} />,
    testcase: <EditTestcasePanel problemId={problemId} />,
  };

  return (
    <div className="relative flex h-full w-full">
      <ProblemEditFlexLayout components={components} />
    </div>
  );
};
