"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface ChartDataPoint {
  kind: string;
  score: number;
  fullMark: number;
}

interface CodeAnalysisRadarChartProps {
  chartData: ChartDataPoint[];
  radarName: string;
}

export function CodeAnalysisRadarChart({
  chartData,
  radarName,
}: CodeAnalysisRadarChartProps) {
  return (
    <ChartContainer config={{}} className="mx-auto aspect-square max-w-[345px]">
      <RadarChart outerRadius={90} data={chartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="kind" />
        <PolarGrid />
        <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
        <Radar
          name={radarName}
          dataKey="score"
          stroke="rgb(95, 134, 196)"
          fill="rgba(95, 134, 196, 0.1)"
        />
      </RadarChart>
    </ChartContainer>
  );
}
