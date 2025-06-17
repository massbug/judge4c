// 简单的环形图组件，使用 SVG 实现
import React from "react";

interface DonutChartProps {
  percent: number; // 完成比例 0-100
  size?: number; // 图表直径
  strokeWidth?: number; // 圆环宽度
  color?: string; // 完成部分颜色
  bgColor?: string; // 未完成部分颜色
}

export function DonutChart({
  percent,
  size = 120,
  strokeWidth = 16,
  color = "#3b82f6",
  bgColor = "#e5e7eb",
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size / 5}
        fontWeight="bold"
        fill="#222"
      >
        {percent}%
      </text>
    </svg>
  );
}
