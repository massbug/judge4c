"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditDetailPanelProps {
  problemId: string;
}

export const EditDetailPanel = ({
  problemId,
}: EditDetailPanelProps) => {
  const [displayId, setDisplayId] = useState(problemId);
  const [difficulty, setDifficulty] = useState("medium");
  const [isPublished, setIsPublished] = useState(true);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display-id">题号</Label>
        <Input
          id="display-id"
          value={displayId}
          onChange={(e) => setDisplayId(e.target.value)}
          placeholder="输入题号"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="difficulty">难度</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="选择难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">简单</SelectItem>
            <SelectItem value="medium">中等</SelectItem>
            <SelectItem value="hard">困难</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="is-published" className="text-sm font-normal">
          是否发布
        </Label>
        <Input
          id="is-published"
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button>保存基本信息</Button>
        <Button variant="outline" type="button">
          删除题目
        </Button>
      </div>
    </div>
  );
};