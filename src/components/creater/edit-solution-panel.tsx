"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreEditor } from "@/components/core-editor";
import { getProblemData } from "@/app/actions/getProblem";// 修改为你实际路径

export default function EditSolutionPanel({
                                            problemId,
                                          }: {
  problemId: string;
}) {
  const [solution, setSolution] = useState({
    title: `Solution for Problem ${problemId}`,
    content: `Solution content for Problem ${problemId}...`,
  });
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "compare">("edit");

  useEffect(() => {
    async function fetchSolution() {
      try {
        const data = await getProblemData(problemId);
        setSolution({
          title: data.title ? data.title + " 解析" : `Solution for Problem ${problemId}`,
          content: data.solution || "",
        });
      } catch (error) {
        console.error("加载题解失败", error);
      }
    }
    fetchSolution();
  }, [problemId]);

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>题目解析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="solution-title">题解标题</Label>
              <Input
                  id="solution-title"
                  value={solution.title}
                  onChange={(e) => setSolution({ ...solution, title: e.target.value })}
                  placeholder="输入题解标题"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                  type="button"
                  variant={viewMode === "edit" ? "default" : "outline"}
                  onClick={() => setViewMode("edit")}
              >
                编辑
              </Button>
              <Button
                  type="button"
                  variant={viewMode === "preview" ? "default" : "outline"}
                  onClick={() => setViewMode(viewMode === "preview" ? "edit" : "preview")}
              >
                {viewMode === "preview" ? "取消" : "预览"}
              </Button>
              <Button
                  type="button"
                  variant={viewMode === "compare" ? "default" : "outline"}
                  onClick={() => setViewMode("compare")}
              >
                对比
              </Button>
            </div>

            <div className={viewMode === "compare" ? "grid grid-cols-2 gap-6" : "flex flex-col gap-6"}>
              <div className={viewMode === "edit" || viewMode === "compare" ? "block" : "hidden"}>
                <div className="relative h-[600px]">
                  <CoreEditor
                      value={solution.content}
                      onChange={(newContent) => setSolution({ ...solution, content: newContent })}
                      language="markdown"
                      className="absolute inset-0 rounded-md border border-input"
                  />
                </div>
              </div>

              {viewMode !== "edit" && (
                  <div className="prose dark:prose-invert">
                    <MdxPreview source={solution.content} />
                  </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
