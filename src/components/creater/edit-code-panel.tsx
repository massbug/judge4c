"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CoreEditor } from "@/components/core-editor";

interface Template {
  id: string;
  language: string;
  code: string;
}

interface EditCodePanelProps {
  problemId: string;
}

export const EditCodePanel = ({
  problemId,
}: EditCodePanelProps) => {
  const [language, setLanguage] = useState("typescript");
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      language: "typescript",
      code: `// TypeScript模板示例\nfunction twoSum(nums: number[], target: number): number[] {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
    },
    {
      id: "2",
      language: "python",
      code: "# Python模板示例\ndef two_sum(nums, target):\n    num_dict = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_dict:\n            return [num_dict[complement], i]\n        num_dict[num] = i\n    return []"
    }
  ]);
  
  const currentTemplate = templates.find(t => t.language === language) || templates[0];

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return;
    
    setTemplates(templates.map(t => 
      t.language === language 
        ? { ...t, code: value } 
        : t
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="language">编程语言</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="选择编程语言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md h-[500px]">
        {currentTemplate && (
          <CoreEditor
            language={language}
            value={currentTemplate.code}
            path={`/${problemId}.${language}`}
            onChange={handleCodeChange}
          />
        )}
      </div>
      
      <Button>保存代码模板</Button>
    </div>
  );
};