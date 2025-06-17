"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreEditor } from '@/components/core-editor';
import { getProblemData } from '@/app/actions/getProblem';
import { Accordion } from "@/components/ui/accordion"; // ← 这里导入 Accordion

export default function EditDescriptionPanel({
                                               problemId,
                                             }: {
  problemId: string;
}) {
  const [description, setDescription] = useState({
    title: `Description for Problem ${problemId}`,
    content: `Description content for Problem ${problemId}...`
  });
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'compare'>('edit');

  useEffect(() => {
    async function fetchData() {
      try {
        const problemData = await getProblemData(problemId);
        setDescription({
          title: problemData.title,
          content: problemData.description
        });
      } catch (error) {
        console.error('获取题目信息失败:', error);
      }
    }

    fetchData();
  }, [problemId]);

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>题目描述</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description-title">标题</Label>
              <Input
                  id="description-title"
                  value={description.title}
                  onChange={(e) => setDescription({...description, title: e.target.value})}
                  placeholder="输入题目标题"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                  type="button"
                  variant={viewMode === 'edit' ? 'default' : 'outline'}
                  onClick={() => setViewMode('edit')}
              >
                编辑
              </Button>
              <Button
                  type="button"
                  variant={viewMode === 'preview' ? 'default' : 'outline'}
                  onClick={() => setViewMode(viewMode === 'preview' ? 'edit' : 'preview')}
              >
                {viewMode === 'preview' ? '取消' : '预览'}
              </Button>
              <Button
                  type="button"
                  variant={viewMode === 'compare' ? 'default' : 'outline'}
                  onClick={() => setViewMode('compare')}
              >
                对比
              </Button>
            </div>

            <div className={viewMode === 'compare' ? "grid grid-cols-2 gap-6" : "flex flex-col gap-6"}>
              <div className={viewMode === 'edit' || viewMode === 'compare' ? "block" : "hidden"}>
                <div className="relative h-[600px]">
                  <CoreEditor
                      value={description.content}
                      onChange={(newContent) =>
                          setDescription({ ...description, content: newContent || '' })
                      }
                      language="markdown"
                      className="absolute inset-0 rounded-md border border-input"
                  />
                </div>
              </div>
              {viewMode !== 'edit' && (
                  <div className="prose dark:prose-invert">
                    <MdxPreview
                        source={description.content}
                        components={{ Accordion }} // ← 这里传入 Accordion
                    />
                  </div>
              )}
            </div>

            <Button>保存更改</Button>
          </div>
        </CardContent>
      </Card>
  );
}
