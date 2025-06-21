import { PanelLayout } from "@/features/problems/layouts/panel-layout";
import { AnalysisContent } from "@/features/problems/analysis/components/content";

interface AnalysisPanelProps {
  submissionId: string | undefined;
}

export const AnalysisPanel = ({ submissionId }: AnalysisPanelProps) => {
  return (
    <PanelLayout>
      <AnalysisContent submissionId={submissionId} />
    </PanelLayout>
  );
};
