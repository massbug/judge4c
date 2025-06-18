"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getStudentDashboardData } from "@/actions/student-dashboard";

interface DashboardData {
  completionData: {
    total: number;
    completed: number;
    percentage: number;
  };
  errorData: {
    total: number;
    wrong: number;
    percentage: number;
  };
  difficultProblems: Array<{
    id: string | number;
    title: string;
    difficulty: string;
    errorCount: number;
  }>;
  pieChartData: Array<{ name: string; value: number }>;
  errorPieChartData: Array<{ name: string; value: number }>;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("开始获取学生仪表板数据...");
        setLoading(true);
        const dashboardData = await getStudentDashboardData();
        console.log("获取到的数据:", dashboardData);
        console.log("完成情况:", dashboardData.completionData);
        console.log("错误情况:", dashboardData.errorData);
        console.log("易错题:", dashboardData.difficultProblems);
        setData(dashboardData);
      } catch (err) {
        console.error("获取数据时出错:", err);
        setError(err instanceof Error ? err.message : "获取数据失败");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">错误: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">暂无数据</div>
      </div>
    );
  }

  const { completionData, errorData, difficultProblems, pieChartData, errorPieChartData } = data;
  const COLORS = ["#4CAF50", "#FFC107"];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">学生仪表板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 题目完成比例模块 */}
        <Card>
          <CardHeader>
            <CardTitle>题目完成比例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>已完成题目：{completionData.completed}/{completionData.total}</span>
                <span className="text-green-500">{completionData.percentage}%</span>
              </div>
              <Progress value={completionData.percentage} className="h-2" />
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错题比例模块 */}
        <Card>
          <CardHeader>
            <CardTitle>错题比例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>错题数量：{errorData.wrong}/{errorData.total}</span>
                <span className="text-yellow-500">{errorData.percentage}%</span>
              </div>
              <Progress value={errorData.percentage} className="h-2" />
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorPieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {errorPieChartData.map((entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 易错题练习模块 */}
      <Card>
        <CardHeader>
          <CardTitle>易错题练习</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>易错题数量：{difficultProblems.length}</span>
            </div>
            {difficultProblems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>题目ID</TableHead>
                    <TableHead>题目名称</TableHead>
                    <TableHead>难度</TableHead>
                    <TableHead>错误次数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {difficultProblems.map((problem: { id: string | number; title: string; difficulty: string; errorCount: number }) => (
                    <TableRow key={problem.id}>
                      <TableCell>{problem.id}</TableCell>
                      <TableCell>{problem.title}</TableCell>
                      <TableCell>{problem.difficulty}</TableCell>
                      <TableCell>{problem.errorCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无易错题数据
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 