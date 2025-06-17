"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProblemData } from "@/app/actions/getProblem";

export default function EditTestcasePanel({
                                            problemId,
                                          }: {
  problemId: string;
}) {
  const [testcases, setTestcases] = useState<
      Array<{
        id: string;
        expectedOutput: string;
        inputs: Array<{
          name: string;
          value: string;
        }>;
      }>
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const problemData = await getProblemData(problemId);
        if (problemData && problemData.testcases) {
          setTestcases(problemData.testcases);
        } else {
          setTestcases([]);
        }
      } catch (error) {
        console.error("加载测试用例失败:", error);
        setTestcases([]);
      }
    }
    fetchData();
  }, [problemId]);

  const handleAddTestcase = () => {
    setTestcases([
      ...testcases,
      {
        id: `new-${Date.now()}`,
        expectedOutput: "",
        inputs: [{ name: "input1", value: "" }],
      },
    ]);
  };

  const handleRemoveTestcase = (index: number) => {
    const newTestcases = [...testcases];
    newTestcases.splice(index, 1);
    setTestcases(newTestcases);
  };

  const handleInputChange = (
      testcaseIndex: number,
      inputIndex: number,
      field: "name" | "value",
      value: string
  ) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].inputs[inputIndex][field] = value;
    setTestcases(newTestcases);
  };

  const handleExpectedOutputChange = (testcaseIndex: number, value: string) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].expectedOutput = value;
    setTestcases(newTestcases);
  };

  const handleAddInput = (testcaseIndex: number) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].inputs.push({
      name: `input${newTestcases[testcaseIndex].inputs.length + 1}`,
      value: "",
    });
    setTestcases(newTestcases);
  };

  const handleRemoveInput = (testcaseIndex: number, inputIndex: number) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].inputs.splice(inputIndex, 1);
    setTestcases(newTestcases);
  };

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>测试用例</CardTitle>
          <Button type="button" onClick={handleAddTestcase}>
            添加测试用例
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {testcases.map((testcase, index) => (
                <div key={testcase.id} className="border p-4 rounded-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">测试用例 {index + 1}</h3>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveTestcase(index)}
                    >
                      删除
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`expected-output-${index}`}>预期输出</Label>
                    <Input
                        id={`expected-output-${index}`}
                        value={testcase.expectedOutput}
                        onChange={(e) => handleExpectedOutputChange(index, e.target.value)}
                        placeholder="输入预期输出"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>输入参数</Label>
                      <Button type="button" onClick={() => handleAddInput(index)}>
                        添加输入
                      </Button>
                    </div>

                    {testcase.inputs.map((input, inputIndex) => (
                        <div key={input.name} className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`input-name-${index}-${inputIndex}`}>
                              参数名称
                            </Label>
                            <Input
                                id={`input-name-${index}-${inputIndex}`}
                                value={input.name}
                                onChange={(e) =>
                                    handleInputChange(index, inputIndex, "name", e.target.value)
                                }
                                placeholder="输入参数名称"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`input-value-${index}-${inputIndex}`}>
                              参数值
                            </Label>
                            <Input
                                id={`input-value-${index}-${inputIndex}`}
                                value={input.value}
                                onChange={(e) =>
                                    handleInputChange(index, inputIndex, "value", e.target.value)
                                }
                                placeholder="输入参数值"
                            />
                          </div>
                          {inputIndex > 0 && (
                              <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleRemoveInput(index, inputIndex)}
                                  className="w-full"
                              >
                                删除输入
                              </Button>
                          )}
                        </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
  );
}
