"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProblemData } from "@/app/actions/getProblem";

export default function EditDetailPanel({
                                          problemId,
                                        }: {
  problemId: string;
}) {
  const [problemDetails, setProblemDetails] = useState({
    displayId: 1000,
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    timeLimit: 1000,
    memoryLimit: 134217728,
    isPublished: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const problemData = await getProblemData(problemId);
        setProblemDetails({
          displayId: problemData.displayId,
          difficulty: problemData.difficulty,
          timeLimit: problemData.timeLimit,
          memoryLimit: problemData.memoryLimit,
          isPublished: problemData.isPublished,
        });
      } catch (error) {
        console.error("获取题目信息失败:", error);
      }
    }
    fetchData();
  }, [problemId]);

  const handleNumberInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: keyof typeof problemDetails
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setProblemDetails({
        ...problemDetails,
        [field]: value,
      });
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "EASY" || value === "MEDIUM" || value === "HARD") {
      setProblemDetails({ ...problemDetails, difficulty: value });
    }
  };

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>题目详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display-id">显示ID</Label>
                <Input
                    id="display-id"
                    type="number"
                    value={problemDetails.displayId}
                    onChange={(e) => handleNumberInputChange(e, "displayId")}
                    placeholder="输入显示ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty-select">难度等级</Label>
                <select
                    id="difficulty-select"
                    className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={problemDetails.difficulty}
                    onChange={handleDifficultyChange}
                >
                  <option value="EASY">简单</option>
                  <option value="MEDIUM">中等</option>
                  <option value="HARD">困难</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-limit">时间限制 (ms)</Label>
                <Input
                    id="time-limit"
                    type="number"
                    value={problemDetails.timeLimit}
                    onChange={(e) => handleNumberInputChange(e, "timeLimit")}
                    placeholder="输入时间限制"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-limit">内存限制 (字节)</Label>
                <Input
                    id="memory-limit"
                    type="number"
                    value={problemDetails.memoryLimit}
                    onChange={(e) => handleNumberInputChange(e, "memoryLimit")}
                    placeholder="输入内存限制"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                  id="is-published"
                  type="checkbox"
                  checked={problemDetails.isPublished}
                  onChange={(e) =>
                      setProblemDetails({ ...problemDetails, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <Label
                  htmlFor="is-published"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                是否发布
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
