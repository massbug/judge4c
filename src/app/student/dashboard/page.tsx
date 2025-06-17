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

export default function StudentDashboard() {
  // 模拟数据
  const completionData = {
    total: 100,
    completed: 65,
    percentage: 65,
  };

  const errorData = {
    total: 100,
    wrong: 35,
    percentage: 35,
  };

  const pieChartData = [
    { name: "已完成", value: 65 },
    { name: "未完成", value: 35 },
  ];

  const COLORS = ["#4CAF50", "#FFC107"];

  const difficultProblems = [
    { id: 1, title: "动态规划基础", difficulty: "困难", errorCount: 5 },
    { id: 2, title: "图论算法", difficulty: "中等", errorCount: 3 },
    { id: 3, title: "数据结构", difficulty: "困难", errorCount: 4 },
  ];

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
                      {pieChartData.map((entry, index) => (
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
                      data={[
                        { name: "正确", value: (errorData.total - errorData.wrong) },
                        { name: "错误", value: errorData.wrong },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
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
                {difficultProblems.map((problem) => (
                  <TableRow key={problem.id}>
                    <TableCell>{problem.id}</TableCell>
                    <TableCell>{problem.title}</TableCell>
                    <TableCell>{problem.difficulty}</TableCell>
                    <TableCell>{problem.errorCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 