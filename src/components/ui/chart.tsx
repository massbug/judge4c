"use client"

import * as React from "react"
import {
  BarChart as RechartsChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [k: string]: {
    label: string
    color?: string
    icon?: React.ElementType
  }
}

interface CustomCSSProperties extends React.CSSProperties {
  [key: `--color-${string}`]: string;
}

type ChartContainerProps = React.ComponentProps<typeof RechartsChart> & {
  config: ChartConfig
  children: React.ReactNode
  className?: string
  width?: number | string
  height?: number | string
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  config,
  children,
  className,
  width,
  height,
  ...props
}) => {
  const chartVars = React.useMemo(() => {
    return Object.entries(config).reduce((acc: CustomCSSProperties, [key, item]) => {
      if (item.color) {
        acc[`--color-${key}`] = item.color;
      }
      return acc;
    }, {} as CustomCSSProperties);
  }, [config]);

  return (
    <div
      className={cn("min-h-[400px] w-full", className)}
      style={{ ...chartVars, width: width || "100%", height: height || "400px" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {React.cloneElement(children as React.ReactElement, props)}
      </ResponsiveContainer>
    </div>
  )
}

type ChartTooltipProps = React.ComponentProps<typeof Tooltip> & {
  content?: React.ReactNode
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ content, ...props }) => {
  return <Tooltip content={content} {...props} />
}

type ChartTooltipContentProps = TooltipProps<any, any> & {
  hideLabel?: boolean
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ 
  hideLabel, 
  payload, 
  label, 
  ...props 
}) => {
  if (!payload || payload.length === 0) return null

  return (
    <div className="rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
      {!hideLabel && <div className="text-sm font-bold">{label}</div>}
      {payload.map((entry, index: number) => {
        const entryName = typeof entry.name === 'string' ? entry.name : (typeof entry.dataKey === 'string' ? entry.dataKey : 'N/A');
        const entryValue = typeof entry.value !== 'undefined' ? entry.value : 'N/A';
        const entryColor = typeof entry.color === 'string' ? entry.color : undefined;

        return (
          <div key={index} className="flex items-center gap-2">
            {entryColor && (
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entryColor }}
              />
            )}
            <span className="text-sm">{entryName}: {entryValue}</span>
          </div>
        );
      })}
    </div>
  )
}