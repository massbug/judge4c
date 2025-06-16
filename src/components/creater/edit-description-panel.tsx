"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {CoreEditor} from "@/components/core-editor";

interface EditDescriptionPanelProps {
  problemId: string;
}

export const EditDescriptionPanel = ({
  problemId,
}: EditDescriptionPanelProps) => {
  const [title, setTitle] = useState(`Problem ${problemId} Title`);
  const [content, setContent] = useState(`Problem ${problemId} Description Content...`);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'compare'>('edit');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>题目描述</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">题目标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                  value={content}
                  onChange={setContent}
                  language="markdown"
                  className="absolute inset-0 rounded-md border border-input"
                />
              </div>
            </div>
            
            <div className={viewMode === 'preview' || viewMode === 'compare' ? "block" : "hidden"}>
              <MdxPreview source={content} />
            </div>
          </div>
          
          <Button>保存更改</Button>
        </div>
      </CardContent>
    </Card>
  );
};