"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, LabelList, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
import { getDashboardStats, ProblemCompletionData, DifficultProblemData } from "@/app/(protected)/dashboard/(userdashboard)/_actions/teacher-dashboard";

const ITEMS_PER_PAGE = 5; // 每页显示的题目数量

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
  const [chartData, setChartData] = useState<ProblemCompletionData[]>([]);
  const [difficultProblems, setDifficultProblems] = useState<DifficultProblemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setChartData(data.problemData);
        setDifficultProblems(data.difficultProblems);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(chartData.length / ITEMS_PER_PAGE);
  
  // 获取当前页的数据
  const currentPageData = chartData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">教师仪表板</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">教师仪表板</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">错误: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">教师仪表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 题目完成情况模块 */}
        <Card className="min-h-[450px]">
          <CardHeader>
            <CardTitle>题目完成情况</CardTitle>
            <CardDescription>各题目完成及未完成人数图表</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">暂无数据</div>
              </div>
            ) : (
              <>
                <ChartContainer config={chartConfig} className="height-{400px}">
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
                      dataKey="problemDisplayId"
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
                {totalPages > 1 && (
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
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              完成度趋势 <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              显示各题目完成情况（已完成/未完成）
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
                <span>出错率较高题目数量：{difficultProblems.length}</span>
              </div>
              {difficultProblems.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-lg text-muted-foreground">暂无易错题数据</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>题目编号</TableHead>
                      <TableHead>题目名称</TableHead>
                      <TableHead>错误次数</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {difficultProblems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell>{problem.problemDisplayId || problem.id.substring(0, 8)}</TableCell>
                        <TableCell>{problem.problemTitle}</TableCell>
                        <TableCell>{problem.problemCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}