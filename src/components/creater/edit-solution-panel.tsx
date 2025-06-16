"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";

interface EditSolutionPanelProps {
  problemId: string;
}

export const EditSolutionPanel = ({
  problemId,
}: EditSolutionPanelProps) => {
  const [title, setTitle] = useState(`Solution for Problem ${problemId}`);
  const [content, setContent] = useState(`Solution content for Problem ${problemId}...`);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'compare'>('edit');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="solution-title">题解标题</Label>
        <Input
          id="solution-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入题解标题"
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
          <Textarea
            id="solution-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入详细题解内容..."
            className="min-h-[300px]"
          />
        </div>
        
        <div className={viewMode === 'preview' || viewMode === 'compare' ? "block" : "hidden"}>
          <MdxPreview source={content} />
        </div>
      </div>
      
      <Button>保存题解</Button>
    </div>
  );
};