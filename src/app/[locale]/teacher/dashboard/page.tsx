"use client"

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

const ITEMS_PER_PAGE = 5; // 每页显示的班级数量

// 班级完成比例数据
const classData = [
  { classnumber: "24001", completed: 150, uncompleted: 30, total: 180 },
  { classnumber: "24002", completed: 250, uncompleted: 50, total: 300 },
  { classnumber: "24003", completed: 200, uncompleted: 40, total: 240 },
  { classnumber: "24004", completed: 60, uncompleted: 15, total: 75 },
  { classnumber: "24005", completed: 180, uncompleted: 30, total: 210 },
  { classnumber: "24006", completed: 190, uncompleted: 25, total: 215 },
].map(item => ({
  ...item,
  completedPercent: item.completed / item.total,
  uncompletedPercent: item.uncompleted / item.total,
}));

// 题目提交数据
const problemData = [
  { name: "题目1", submissions: 120, passRate: 85 },
  { name: "题目2", submissions: 98, passRate: 92 },
  { name: "题目3", submissions: 86, passRate: 78 },
  { name: "题目4", submissions: 99, passRate: 90 },
  { name: "题目5", submissions: 85, passRate: 88 },
  { name: "题目6", submissions: 90, passRate: 85 },
];

// 图表配置
const classChartConfig: ChartConfig = {
  completed: {
    label: "已完成",
    color: "hsl(200, 100%, 70%)", // 浅蓝色
  },
  uncompleted: {
    label: "未完成",
    color: "hsl(220, 10%, 80%)", // 浅灰色
  },
};

const problemChartConfig: ChartConfig = {
  submissions: {
    label: "提交数",
    color: "#2563eb",
  },
  passRate: {
    label: "通过率",
    color: "#16a34a",
  },
};

// 模拟提交记录
const mockSubmissions = [
  {
    id: 1,
    student: "张三",
    problem: "题目1",
    status: "通过",
    time: "2024-03-20 10:30",
  },
  {
    id: 2,
    student: "李四",
    problem: "题目2",
    status: "未通过",
    time: "2024-03-20 11:15",
  },
  {
    id: 3,
    student: "王五",
    problem: "题目3",
    status: "通过",
    time: "2024-03-20 14:20",
  },
];

// 模拟易错题数据
const difficultProblems = [
  { id: 1, className: "一年级(1)班", problemCount: 15 },
  { id: 2, className: "一年级(2)班", problemCount: 12 },
  { id: 3, className: "二年级(1)班", problemCount: 10 },
];

export default function TeacherDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalPages = Math.ceil(classData.length / ITEMS_PER_PAGE);
  const currentPageData = classData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">教师仪表板</h1>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
          >
            本周
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
          >
            本月
          </Button>
          <Button
            variant={timeRange === "year" ? "default" : "outline"}
            onClick={() => setTimeRange("year")}
          >
            本年
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总提交数</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% 较上周</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">通过率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.6%</div>
            <p className="text-xs text-muted-foreground">+2.3% 较上周</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃学生</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 较上周</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均完成时间</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45分钟</div>
            <p className="text-xs text-muted-foreground">-5分钟 较上周</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>班级完成比例</CardTitle>
            <CardDescription>各班级完成及未完成人数图表</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={classChartConfig} width={600}>
              <BarChart
                data={currentPageData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 20,
                }}
                barCategoryGap={30}
              >
                <XAxis 
                  type="number" 
                  domain={[0, 1]} 
                  hide 
                />
                <YAxis
                  dataKey="classnumber"
                  type="category"
                  tickLine={false}
                  tickMargin={20}
                  axisLine={false}
                  width={100}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="completedPercent" stackId="total" fill={classChartConfig.completed.color} radius={5}>
                  <LabelList dataKey="completed" position="inside" fill="#fff" formatter={(value: number) => `${value}`} />
                </Bar>
                <Bar dataKey="uncompletedPercent" stackId="total" fill={classChartConfig.uncompleted.color} radius={5}>
                  <LabelList dataKey="uncompleted" position="inside" fill="#000" formatter={(value: number) => `${value}`} />
                </Bar>
              </BarChart>
            </ChartContainer>
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

        <Card>
          <CardHeader>
            <CardTitle>题目提交统计</CardTitle>
            <CardDescription>各题目的提交数和通过率</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={problemChartConfig}>
              <BarChart data={problemData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="submissions" fill="var(--color-submissions)" />
                <Bar dataKey="passRate" fill="var(--color-passRate)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>学生易错题</CardTitle>
            <CardDescription>各班级易错题数量及列表</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span>出错率较高班级数量：{difficultProblems.length}</span>
               </div>
               <Table>
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

        <Card>
          <CardHeader>
            <CardTitle>最近提交</CardTitle>
            <CardDescription>学生最近的提交记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学生</TableHead>
                  <TableHead>题目</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.student}</TableCell>
                    <TableCell>{submission.problem}</TableCell>
                    <TableCell>{submission.status}</TableCell>
                    <TableCell>{submission.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              查看全部
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}