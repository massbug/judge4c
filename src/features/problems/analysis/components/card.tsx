"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalysis } from "@/app/actions/analyze";
import { Loader2Icon, TerminalIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ChartDataPoint,
  CodeAnalysisRadarChart,
} from "@/features/problems/analysis/components/radar-chart";
import type { AnalysisStatus, CodeAnalysis } from "@/generated/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AnalysisCardProps {
  submissionId: string;
}

const ACTIVE_STATUSES: AnalysisStatus[] = ["PENDING", "QUEUED", "PROCESSING"];
const FINAL_STATUSES: AnalysisStatus[] = ["COMPLETED", "FAILED"];

export const AnalysisCard = ({ submissionId }: AnalysisCardProps) => {
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);

  const fetchAnalysis = useCallback(() => {
    getAnalysis(submissionId)
      .then((analysis) => {
        setAnalysis(analysis);
      })
      .catch((error) => {
        toast.error("Analysis Update Failed", {
          description: error.message || "Failed to fetch analysis data.",
        });
      });
  }, [submissionId]);

  useEffect(() => {
    if (!analysis) {
      fetchAnalysis();
    }

    const interval = setInterval(() => {
      if (!analysis || ACTIVE_STATUSES.includes(analysis.status)) {
        fetchAnalysis();
      } else if (FINAL_STATUSES.includes(analysis.status)) {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [analysis, fetchAnalysis]);

  if (!analysis) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader className="items-center pb-2 space-y-1 px-6 pt-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 min-h-64">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analysis.status === "FAILED") {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader className="items-center pb-2 space-y-1 px-6 pt-6">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            Code Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <TerminalIcon className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>
              We couldn&apos;t analyze your code. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (analysis.status !== "COMPLETED") {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden border-0 bg-background/50 backdrop-blur-sm">
        <CardHeader className="items-center pb-2 space-y-1 px-6 pt-6">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
            Code Analysis
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Preparing your detailed evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 min-h-64">
            <div className="relative">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></span>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">
                Processing your submission
              </p>
              <p className="text-sm text-muted-foreground/60">
                This may take a few moments...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform the data into a format suitable for the RadarChart
  const chartData: ChartDataPoint[] = [
    {
      kind: "overall",
      score: analysis.overallScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "style",
      score: analysis.styleScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "readability",
      score: analysis.readabilityScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "efficiency",
      score: analysis.efficiencyScore ?? 0,
      fullMark: 100,
    },
    {
      kind: "correctness",
      score: analysis.correctnessScore ?? 0,
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
      <CardContent className="p-0">
        <CodeAnalysisRadarChart chartData={chartData} />
      </CardContent>

      <CardFooter className="flex-col items-start gap-4 p-6 pt-0">
        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Overall Score</span>
            <span className="text-primary">
              {analysis.overallScore ?? "N/A"}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${analysis.overallScore ?? 0}%`,
                transitionProperty: "width",
              }}
            />
          </div>
        </div>

        <div className="text-muted-foreground bg-muted/40 p-4 rounded-lg w-full border">
          <h3 className="font-medium mb-2 text-foreground">Feedback</h3>
          <p className="whitespace-pre-wrap leading-relaxed">
            {analysis.feedback}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
