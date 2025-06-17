// src/app/teacher/dashboard/page.tsx 的完整修正代码
"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, LabelList, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 5; // 每页显示的班级数量

const chartData = [
  { classnumber: "24001", completed: 150, uncompleted: 30, total: 180 },
  { classnumber: "24002", completed: 250, uncompleted: 50, total: 300 },
  { classnumber: "24003", completed: 200, uncompleted: 40, total: 240 },
  { classnumber: "24004", completed: 60, uncompleted: 15, total: 75 },
  { classnumber: "24005", completed: 180, uncompleted: 30, total: 210 },
  { classnumber: "24006", completed: 190, uncompleted: 25, total: 215 },
].map(item => ({
  ...item,
  completedPercent: (item.completed / item.total) * 100,
  uncompletedPercent: (item.uncompleted / item.total) * 100,
}));

const chartConfig = {
  completed: {
    label: "已完成",
    color: "#4CAF50", // 使用更鲜明的颜色
  },
  uncompleted: {
    label: "未完成",
    color: "#FFA726", // 使用更鲜明的颜色
  },
} satisfies ChartConfig;

export default function TeacherDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(chartData.length / ITEMS_PER_PAGE);
  
  // 获取当前页的数据
  const currentPageData = chartData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 模拟易错题数据
  const difficultProblems = [
    { id: 1, className: "一年级(1)班", problemCount: 15 },
    { id: 2, className: "一年级(2)班", problemCount: 12 },
    { id: 3, className: "二年级(1)班", problemCount: 10 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">教师仪表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 班级完成比例模块 */}
        <Card className="min-h-[450px]">
          <CardHeader>
            <CardTitle>班级完成比例</CardTitle>
            <CardDescription>各班级完成及未完成人数图表</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} height={400}>
              <BarChart
                data={currentPageData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 40,
                  bottom: 5,
                }}
                barCategoryGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  dataKey="classnumber"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  width={80}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="completedPercent" 
                  name="已完成" 
                  fill={chartConfig.completed.color} 
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList 
                    dataKey="completed" 
                    position="right" 
                    fill="#000" 
                    formatter={(value: number) => `${value}人`} 
                  />
                </Bar>
                <Bar 
                  dataKey="uncompletedPercent" 
                  name="未完成" 
                  fill={chartConfig.uncompleted.color} 
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList 
                    dataKey="uncompleted" 
                    position="right" 
                    fill="#000" 
                    formatter={(value: number) => `${value}人`} 
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
            {/* 分页控制 */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <span className="text-sm">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              完成度趋势 <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              显示各班级题目完成情况（已完成/未完成）
            </div>
          </CardFooter>
        </Card>

        {/* 学生易错题模块 */}
        <Card className="min-h-[450px]">
          <CardHeader>
            <CardTitle>学生易错题</CardTitle>
            <CardDescription>各班级易错题数量及列表</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>出错率较高班级数量：{difficultProblems.length}</span>
              </div>
              <Table> {/* 确保 Table 组件包裹 TableHeader 和 TableBody */}
                <TableHeader>
                  <TableRow>
                    <TableHead>班级ID</TableHead>
                    <TableHead>班级名称</TableHead>
                    <TableHead>易错题数量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {difficultProblems.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell>{problem.id}</TableCell>
                      <TableCell>{problem.className}</TableCell>
                      <TableCell>{problem.problemCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}