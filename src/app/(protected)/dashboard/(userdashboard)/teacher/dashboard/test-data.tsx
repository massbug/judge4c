"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/app/(protected)/dashboard/(userdashboard)/_actions/teacher-dashboard";

interface DashboardData {
  problemData: Array<{
    problemId: string;
    problemDisplayId: number;
    problemTitle: string;
    completed: number;
    uncompleted: number;
    total: number;
    completedPercent: number;
    uncompletedPercent: number;
  }>;
  difficultProblems: Array<{
    id: string;
    className: string;
    problemCount: number;
    problemTitle: string;
    problemDisplayId: number;
  }>;
  totalProblems: number;
  totalDifficultProblems: number;
}

export default function TestDataPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardStats();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">数据测试页面</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">题目完成数据</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data?.problemData, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">易错题数据</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data?.difficultProblems, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">统计信息</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              totalProblems: data?.totalProblems,
              totalDifficultProblems: data?.totalDifficultProblems,
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 