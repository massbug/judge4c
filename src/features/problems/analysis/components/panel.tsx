import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { ChartDataPoint, CodeAnalysisRadarChart } from "./radar-chart";

export const description = "A server component to fetch code analysis data.";

interface AnalysisPanelProps {
  submissionId: string | undefined;
}

export const AnalysisPanel = async ({ submissionId }: AnalysisPanelProps) => {
  if (!submissionId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No submission ID provided.
      </div>
    );
  }

  const codeAnalysisData = await prisma.codeAnalysis.findUnique({
    where: {
      submissionId: submissionId,
    },
  });

  if (!codeAnalysisData) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No analysis data found for this submission.
      </div>
    );
  }

  // Transform the data into a format suitable for the RadarChart
  const chartData: ChartDataPoint[] = [
    {
      kind: "overall",
      score: codeAnalysisData.overallScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "style",
      score: codeAnalysisData.styleScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "readability",
      score: codeAnalysisData.readabilityScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "efficiency",
      score: codeAnalysisData.efficiencyScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "correctness",
      score: codeAnalysisData.correctnessScore ?? 0,
      fullMark: 100,
    },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden border-0 bg-background/50 backdrop-blur-sm animate-fade-in">
      <CardHeader className="items-center pb-2 space-y-1 px-6 pt-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          Code Analysis
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Detailed evaluation of your code submission
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <CodeAnalysisRadarChart chartData={chartData} />
      </CardContent>

      <CardFooter className="flex-col items-start gap-4 p-6 pt-0">
        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Overall Score</span>
            <span className="text-primary">
              {codeAnalysisData.overallScore ?? "N/A"}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${codeAnalysisData.overallScore ?? 0}%`,
                transitionProperty: "width",
              }}
            />
          </div>
        </div>

        <div className="text-muted-foreground bg-muted/40 p-4 rounded-lg w-full border">
          <h3 className="font-medium mb-2 text-foreground">Feedback</h3>
          <p className="whitespace-pre-wrap leading-relaxed">
            {codeAnalysisData.feedback}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
