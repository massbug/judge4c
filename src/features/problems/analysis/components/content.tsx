import { AnalysisCard } from "@/features/problems/analysis/components/card";

interface AnalysisContentProps {
  submissionId: string | undefined;
}

export const AnalysisContent = ({ submissionId }: AnalysisContentProps) => {
  if (!submissionId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No submission ID provided.
      </div>
    );
  }

  return <AnalysisCard submissionId={submissionId} />;
};
