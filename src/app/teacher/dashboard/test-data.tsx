"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "@/actions/teacher-dashboard";

export default function TestDataPage() {
  const [data, setData] = useState<any>(null);
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
          <h2 className="text-xl font-semibold mb-2">班级完成数据</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data?.classData, null, 2)}
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
              totalClasses: data?.totalClasses,
              totalDifficultProblems: data?.totalDifficultProblems,
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 