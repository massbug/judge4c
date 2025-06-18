"use client";

import {useState, useEffect} from "react";
import {generateAITestcase} from "@/app/actions/ai-testcase";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {getProblemData} from "@/app/actions/getProblem";

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
                inputs: [{name: "input1", value: ""}],
            },
        ]);
    };

    const [isGenerating, setIsGenerating] = useState(false);

    const handleAITestcase = async () => {
        setIsGenerating(true);
        try {
            const AIOutputParsed = await generateAITestcase({problemId: problemId});
            setTestcases([
                ...testcases,
                {
                    id: `new-${Date.now()}`,
                    expectedOutput: AIOutputParsed.expectedOutput,
                    inputs: AIOutputParsed.inputs
                }
            ])
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
            });
        } catch (error) {
            console.error(error)
        } finally {
            setIsGenerating(false);
        }
    }

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
                <div className="flex items-center space-x-1"> {/* space-x-1 让按钮更接近 */}
                    <Button type="button" onClick={handleAddTestcase}>
                        添加测试用例
                    </Button>
                    <Button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={handleAITestcase}
                        disabled={isGenerating}
                        style={{
                            opacity: isGenerating ? 0.7 : 1,
                            cursor: isGenerating ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <svg
                            data-testid="geist-icon"
                            height="16"
                            strokeLinejoin="round"
                            style={{color: isGenerating ? '#888' : "currentColor"}}
                            viewBox="0 0 16 16"
                            width="16"
                        >
                            <path
                                d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
                                fill="currentColor"></path>
                            <path
                                d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
                                fill="currentColor"></path>
                            <path
                                d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
                                fill="currentColor"></path>
                        </svg>
                        {isGenerating ? '生成中...' : '使用AI生成测试用例'}
                    </Button>
                </div>
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
