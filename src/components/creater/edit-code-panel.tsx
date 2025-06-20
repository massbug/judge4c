"use client";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Language } from "@/generated/client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { CoreEditor } from "@/components/core-editor";
import { getProblemData } from "@/app/actions/getProblem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";
import { updateProblemTemplate } from "@/components/creater/problem-maintain";

interface Template {
  language: string;
  content: string;
}

interface EditCodePanelProps {
  problemId: string;
}

export default function EditCodePanel({ problemId }: EditCodePanelProps) {
  const [codeTemplate, setCodeTemplate] = useState<Template>({
    language: "cpp",
    content: `// 默认代码模板 for Problem ${problemId}`,
  });
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const problem = await getProblemData(problemId);
        setTemplates(problem.templates);
        const sel =
          problem.templates.find((t) => t.language === "cpp") ||
          problem.templates[0];
        if (sel) setCodeTemplate(sel);
      } catch (err) {
        console.error("加载问题数据失败:", err);
        toast.error("加载问题数据失败");
      }
    }
    fetchTemplates();
  }, [problemId]);

  const handleLanguageChange = (language: string) => {
    const sel = templates.find((t) => t.language === language);
    if (sel) setCodeTemplate(sel);
  };

  const handleSave = async (): Promise<void> => {
    try {
      const res = await updateProblemTemplate(
        problemId,
        codeTemplate.language as Language,
        codeTemplate.content
      );
      if (res.success) {
        toast.success("保存成功");
      } else {
        toast.error("保存失败");
      }
    } catch (error) {
      console.error("保存异常:", error);
      toast.error("保存异常");
    }
  };

  return (
    <PanelLayout>
      <ScrollArea className="h-full">
        <Card className="w-full rounded-none border-none bg-background">
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <span>代码模板</span>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language-select">编程语言</Label>
                <select
                  id="language-select"
                  className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                  value={codeTemplate.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {templates.map((t) => (
                    <option key={t.language} value={t.language}>
                      {t.language.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-editor">代码模板内容</Label>
                <div className="border rounded-md h-[500px]">
                  <CoreEditor
                    language={codeTemplate.language}
                    value={codeTemplate.content}
                    path={`/${problemId}.${codeTemplate.language}`}
                    onChange={(value) =>
                      setCodeTemplate({ ...codeTemplate, content: value || "" })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </PanelLayout>
  );
}
