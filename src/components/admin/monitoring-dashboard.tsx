'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebVitals } from "@/hooks/use-web-vitals";
import { useEffect } from "react";

interface MonitoringDashboardProps {
  userCount: number;
  problemCount: number;
}

export function MonitoringDashboard({
  userCount,
  problemCount
}: MonitoringDashboardProps) {
  const { vitals, loading } = useWebVitals();

  // 添加日志输出性能指标读取结果（已注释）
  useEffect(() => {
    if (!loading) {
      // console.log('[仪表盘] 当前显示指标:', {
      //   lcp: vitals.lcp ? `${vitals.lcp.value.toFixed(2)}秒(${vitals.lcp.rating})` : '未收集',
      //   fid: vitals.fid ? `${vitals.fid.value.toFixed(2)}毫秒(${vitals.fid.rating})` : '未收集',
      //   cls: vitals.cls ? `${vitals.cls.value.toFixed(2)}(${vitals.cls.rating})` : '未收集',
      //   fcp: vitals.fcp ? `${vitals.fcp.value.toFixed(2)}秒(${vitals.fcp.rating})` : '未收集'
      // });
    }
  }, [loading, vitals]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 用户统计 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            活跃用户
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userCount}</div>
          <p className="text-xs text-muted-foreground">
            +20% 本月新增
          </p>
        </CardContent>
      </Card>

      {/* 题目统计 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            在线题目
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="7" rx="2"></rect>
            <path d="M16 19h6"></path>
            <path d="M22 15h-6"></path>
            <path d="M22 11h-6"></path>
            <path d="M22 7h-6"></path>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{problemCount}</div>
          <p className="text-xs text-muted-foreground">
            +15% 本周新增
          </p>
        </CardContent>
      </Card>

      {/* 性能指标卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>性能指标</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="font-medium">LCP:</dt>
            <dd>{loading ? '加载中...' : vitals.lcp ? `${vitals.lcp.value.toFixed(2)} 秒(${vitals.lcp.rating})` : '暂无数据'}</dd>
            
            <dt className="font-medium">FID:</dt>
            <dd>{loading ? '加载中...' : vitals.fid ? `${vitals.fid.value.toFixed(2)} 毫秒(${vitals.fid.rating})` : '暂无数据'}</dd>
            
            <dt className="font-medium">CLS:</dt>
            <dd>{loading ? '加载中...' : vitals.cls ? `${vitals.cls.value.toFixed(2)}(${vitals.cls.rating})` : '暂无数据'}</dd>
            
            <dt className="font-medium">FCP:</dt>
            <dd>{loading ? '加载中...' : vitals.fcp ? `${vitals.fcp.value.toFixed(2)} 秒(${vitals.fcp.rating})` : '暂无数据'}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}