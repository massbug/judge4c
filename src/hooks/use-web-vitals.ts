'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect, useState } from 'react';

export interface WebVital {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface WebVitals {
  lcp?: WebVital;
  fid?: WebVital;
  cls?: WebVital;
  fcp?: WebVital;
}

export function useWebVitals() {
  const [vitals, setVitals] = useState<WebVitals>({
    lcp: undefined,
    fid: undefined,
    cls: undefined,
    fcp: undefined,
  });
  const [loading, setLoading] = useState(true);

  // 添加详细日志记录指标接收（已注释）
  useReportWebVitals((metric) => {
    // console.log(`[Web Vitals] 接收指标: ${metric.name}`, {
    //   value: metric.value,
    //   rating: getRating(metric)
    // });
    
    setVitals((prev) => ({
      ...prev,
      [metric.name.toLowerCase()]: {
        value: metric.value,
        rating: getRating(metric),
      },
    }));
  });

  // 添加日志记录最终指标状态（已注释）
  useEffect(() => {
    if (!loading) {
      // console.log('[Web Vitals] 当前完整指标:', {
      //   lcp: vitals.lcp?.value,
      //   fid: vitals.fid?.value,
      //   cls: vitals.cls?.value,
      //   fcp: vitals.fcp?.value
      // });
    }
  }, [loading, vitals]);

  // 使用useEffect处理加载状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return { vitals, loading };
}

// 添加更具体的类型定义
interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  if (metric.rating === 'good') return 'good';
  if (metric.rating === 'needs-improvement') return 'needs-improvement';
  return 'poor';
}