import { TestcasePanel } from "@/features/problems/testcase/panel";
import { BotPanel } from "@/features/problems/bot/components/panel";
import { CodePanel } from "@/features/problems/code/components/panel";
import { DetailPanel } from "@/features/problems/detail/components/panel";
import { SolutionPanel } from "@/features/problems/solution/components/panel";
import { SubmissionPanel } from "@/features/problems/submission/components/panel";
import { DescriptionPanel } from "@/features/problems/description/components/panel";
import { ProblemFlexLayout } from "@/features/problems/components/problem-flexlayout";

interface ProblemViewProps {
  problemId: string;
  submissionId: string | undefined;
}

export const ProblemView = ({ problemId, submissionId }: ProblemViewProps) => {
  const components: Record<string, React.ReactNode> = {
    description: <DescriptionPanel problemId={problemId} />,
    solution: <SolutionPanel problemId={problemId} />,
    submission: <SubmissionPanel problemId={problemId} />,
    detail: <DetailPanel submissionId={submissionId} />,
    code: <CodePanel problemId={problemId} />,
    testcase: <TestcasePanel problemId={problemId} />,
    bot: <BotPanel problemId={problemId} />,
  };

  return (
    <div className="relative flex h-full w-full">
      <ProblemFlexLayout components={components} />
    </div>
  );
};
