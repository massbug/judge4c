"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addProblemTestcase,
  updateProblemTestcase,
  deleteProblemTestcase,
} from "@/components/creater/problem-maintain";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { getProblemData } from "@/app/actions/getProblem";
import { generateAITestcase } from "@/app/actions/ai-testcase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";

interface Testcase {
  id: string;
  expectedOutput: string;
  inputs: { name: string; value: string }[];
}

export default function EditTestcasePanel({
  problemId,
}: {
  problemId: string;
}) {
  const [testcases, setTestcases] = useState<Testcase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 加载测试用例
  useEffect(() => {
    async function fetch() {
      try {
        const data = await getProblemData(problemId);
        setTestcases(data.testcases || []);
      } catch (err) {
        console.error("加载测试用例失败:", err);
        toast.error("加载测试用例失败");
      }
    }
    fetch();
  }, [problemId]);

  // 本地添加测试用例
  const handleAddTestcase = () =>
    setTestcases((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${Math.random()}`,
        expectedOutput: "",
        inputs: [{ name: "input1", value: "" }],
      },
    ]);

  // AI 生成测试用例
  const handleAITestcase = async () => {
    setIsGenerating(true);
    try {
      const ai = await generateAITestcase({ problemId });
      setTestcases((prev) => [
        ...prev,
        {
          id: `new-${Date.now()}-${Math.random()}`,
          expectedOutput: ai.expectedOutput,
          inputs: ai.inputs,
        },
      ]);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("AI 生成测试用例失败");
    } finally {
      setIsGenerating(false);
    }
  };

  // 删除测试用例（本地 + 服务器）
  const handleRemoveTestcase = async (idx: number) => {
    const tc = testcases[idx];
    if (!tc.id.startsWith("new-")) {
      try {
        const res = await deleteProblemTestcase(problemId, tc.id);
        if (res.success) toast.success("删除测试用例成功");
        else toast.error("删除测试用例失败");
      } catch (err) {
        console.error(err);
        toast.error("删除测试用例异常");
      }
    }
    setTestcases((prev) => prev.filter((_, i) => i !== idx));
  };

  // 修改预期输出
  const handleExpectedOutputChange = (idx: number, val: string) =>
    setTestcases((prev) => {
      const c = [...prev];
      c[idx] = { ...c[idx], expectedOutput: val };
      return c;
    });

  // 修改输入参数
  const handleInputChange = (
    tIdx: number,
    iIdx: number,
    field: "name" | "value",
    val: string
  ) =>
    setTestcases((prev) => {
      const c = [...prev];
      const newInputs = [...c[tIdx].inputs];
      newInputs[iIdx] = { ...newInputs[iIdx], [field]: val };
      c[tIdx] = { ...c[tIdx], inputs: newInputs };
      return c;
    });

  // 添加输入参数
  const handleAddInput = (tIdx: number) =>
    setTestcases((prev) => {
      const c = [...prev];
      const inputs = [
        ...c[tIdx].inputs,
        { name: `input${c[tIdx].inputs.length + 1}`, value: "" },
      ];
      c[tIdx] = { ...c[tIdx], inputs };
      return c;
    });

  // 删除输入参数
  const handleRemoveInput = (tIdx: number, iIdx: number) =>
    setTestcases((prev) => {
      const c = [...prev];
      const inputs = c[tIdx].inputs.filter((_, i) => i !== iIdx);
      c[tIdx] = { ...c[tIdx], inputs };
      return c;
    });

  // 保存所有测试用例，并刷新最新数据
  const handleSaveAll = async () => {
    try {
      for (let i = 0; i < testcases.length; i++) {
        const tc = testcases[i];
        if (
          tc.expectedOutput.trim() === "" ||
          tc.inputs.some((inp) => !inp.name.trim() || !inp.value.trim())
        ) {
          toast.error(`第 ${i + 1} 个测试用例存在空的输入或输出，保存失败`);
          return;
        }

        if (tc.id.startsWith("new-")) {
          const res = await addProblemTestcase(
            problemId,
            tc.expectedOutput,
            tc.inputs
          );
          if (res.success) {
            toast.success(`新增测试用例 ${i + 1} 成功`);
          } else {
            toast.error(`新增测试用例 ${i + 1} 失败`);
          }
        } else {
          const res = await updateProblemTestcase(
            problemId,
            tc.id,
            tc.expectedOutput,
            tc.inputs
          );
          if (res.success) toast.success(`更新测试用例 ${i + 1} 成功`);
          else toast.error(`更新测试用例 ${i + 1} 失败`);
        }
      }

      // 保存完成后刷新最新测试用例
      const data = await getProblemData(problemId);
      setTestcases(data.testcases || []);
      toast.success("测试用例保存并刷新成功");
    } catch (err) {
      console.error(err);
      toast.error("保存测试用例异常");
    }
  };

  return (
    <PanelLayout>
      <Card className="w-full rounded-none border-none bg-background">
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <span>测试用例</span>
            <div className="flex items-center space-x-2">
              <Button onClick={handleAITestcase} disabled={isGenerating}>
                {isGenerating ? "生成中..." : "AI生成"}
              </Button>
              <Button onClick={handleAddTestcase}>添加</Button>
              <Button variant="secondary" onClick={handleSaveAll}>
                保存
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {testcases.map((tc, idx) => (
            <div key={tc.id} className="border p-4 rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">测试用例 {idx + 1}</h3>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveTestcase(idx)}
                >
                  删除
                </Button>
              </div>
              <div className="space-y-2">
                <Label>预期输出</Label>
                <Input
                  value={tc.expectedOutput}
                  onChange={(e) =>
                    handleExpectedOutputChange(idx, e.target.value)
                  }
                  placeholder="输入预期输出"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>输入参数</Label>
                  <Button onClick={() => handleAddInput(idx)}>添加输入</Button>
                </div>
                {tc.inputs.map((inp, iIdx) => (
                  <div key={iIdx} className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>名称</Label>
                      <Input
                        value={inp.name}
                        onChange={(e) =>
                          handleInputChange(idx, iIdx, "name", e.target.value)
                        }
                        placeholder="参数名称"
                      />
                    </div>
                    <div>
                      <Label>值</Label>
                      <Input
                        value={inp.value}
                        onChange={(e) =>
                          handleInputChange(idx, iIdx, "value", e.target.value)
                        }
                        placeholder="参数值"
                      />
                    </div>
                    {iIdx > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveInput(idx, iIdx)}
                      >
                        删除输入
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PanelLayout>
  );
}
