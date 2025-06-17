'use client';

import { useEffect, useState } from 'react';
import { getProblemData } from '@/app/actions/getProblem';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreEditor } from "@/components/core-editor";

interface Template {
  language: string;
  content: string;
}

interface EditCodePanelProps {
  problemId: string;
  onUpdate?: (data: Template) => Promise<{ success: boolean }>;
}

// 模拟保存函数
async function saveTemplate(data: Template): Promise<{ success: boolean }> {
  try {
    console.log('保存模板数据:', data);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch {
    return { success: false };
  }
}

export default function EditCodePanel({ problemId, onUpdate = saveTemplate }: EditCodePanelProps) {
  const [codeTemplate, setCodeTemplate] = useState<Template>({
    language: 'cpp',
    content: `// 默认代码模板 for Problem ${problemId}`,
  });

  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    async function fetch() {
      try {
        const problem = await getProblemData(problemId);
        setTemplates(problem.templates);
        const cppTemplate = problem.templates.find(t => t.language === 'cpp');
        setCodeTemplate(cppTemplate || problem.templates[0]);
      } catch (err) {
        console.error('加载问题数据失败:', err);
      }
    }
    fetch();
  }, [problemId]);

  const handleLanguageChange = (language: string) => {
    const selected = templates.find(t => t.language === language);
    if (selected) {
      setCodeTemplate(selected);
    }
  };

  // 事件处理函数返回 Promise<void>，不要返回具体数据
  const handleSave = async (): Promise<void> => {
    if (!onUpdate) {
      alert('保存函数未传入，无法保存');
      return;
    }
    try {
      const result = await onUpdate(codeTemplate);
      if (result.success) {
        alert('保存成功');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error(error);
      alert('保存异常');
    }
  };

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>代码模板</CardTitle>
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
                        setCodeTemplate({ ...codeTemplate, content: value || '' })
                    }
                />
              </div>
            </div>

            <Button onClick={handleSave}>保存代码模板</Button>
          </div>
        </CardContent>
      </Card>
  );
}
