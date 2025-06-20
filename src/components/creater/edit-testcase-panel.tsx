"use client";

import React, { useState, useEffect } from "react";
import { generateAITestcase } from "@/app/actions/ai-testcase";
import { getProblemData } from "@/app/actions/getProblem";
import {
    addProblemTestcase,
    updateProblemTestcase,
    deleteProblemTestcase,
} from "@/components/creater/problem-maintain";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Testcase {
    id: string;
    expectedOutput: string;
    inputs: { name: string; value: string }[];
}

export default function EditTestcasePanel({ problemId }: { problemId: string }) {
    const [testcases, setTestcases] = useState<Testcase[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // 1) Load existing testcases
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

    // 2) Local add
    const handleAddTestcase = () =>
        setTestcases((prev) => [
            ...prev,
            { id: `new-${Date.now()}`, expectedOutput: "", inputs: [{ name: "input1", value: "" }] },
        ]);

    // 3) AI generation
    const handleAITestcase = async () => {
        setIsGenerating(true);
        try {
            const ai = await generateAITestcase({ problemId });
            setTestcases((prev) => [
                ...prev,
                { id: `new-${Date.now()}`, expectedOutput: ai.expectedOutput, inputs: ai.inputs },
            ]);
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } catch (err) {
            console.error(err);
            toast.error("AI 生成测试用例失败");
        } finally {
            setIsGenerating(false);
        }
    };

    // 4) Remove (local + remote if existing)
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

    // 5) Field updates
    const handleExpectedOutputChange = (idx: number, val: string) =>
        setTestcases((prev) => {
            const c = [...prev];
            c[idx].expectedOutput = val;
            return c;
        });

    const handleInputChange = (
        tIdx: number,
        iIdx: number,
        field: "name" | "value",
        val: string
    ) =>
        setTestcases((prev) => {
            const c = [...prev];
            c[tIdx].inputs[iIdx][field] = val;
            return c;
        });

    const handleAddInput = (tIdx: number) =>
        setTestcases((prev) => {
            const c = [...prev];
            c[tIdx].inputs.push({ name: `input${c[tIdx].inputs.length + 1}`, value: "" });
            return c;
        });

    const handleRemoveInput = (tIdx: number, iIdx: number) =>
        setTestcases((prev) => {
            const c = [...prev];
            c[tIdx].inputs.splice(iIdx, 1);
            return c;
        });

    // 6) Persist all changes
    const handleSaveAll = async () => {
        try {
            for (const tc of testcases) {
                if (tc.id.startsWith("new-")) {
                    const res = await addProblemTestcase(problemId, tc.expectedOutput, tc.inputs);
                    if (res.success) toast.success("新增测试用例成功");
                    else toast.error("新增测试用例失败");
                } else {
                    const res = await updateProblemTestcase(
                        problemId,
                        tc.id,
                        tc.expectedOutput,
                        tc.inputs
                    );
                    if (res.success) toast.success("更新测试用例成功");
                    else toast.error("更新测试用例失败");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("保存测试用例异常");
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>测试用例</CardTitle>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleAddTestcase}>添加测试用例</Button>
                    <Button onClick={handleAITestcase} disabled={isGenerating}>
                        {isGenerating ? "生成中..." : "使用AI生成测试用例"}
                    </Button>
                    <Button variant="secondary" onClick={handleSaveAll}>
                        保存测试用例
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {testcases.map((tc, idx) => (
                    <div key={tc.id} className="border p-4 rounded space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">测试用例 {idx + 1}</h3>
                            <Button variant="destructive" onClick={() => handleRemoveTestcase(idx)}>
                                删除
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>预期输出</Label>
                            <Input
                                value={tc.expectedOutput}
                                onChange={(e) => handleExpectedOutputChange(idx, e.target.value)}
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
                                            onChange={(e) => handleInputChange(idx, iIdx, "name", e.target.value)}
                                            placeholder="参数名称"
                                        />
                                    </div>
                                    <div>
                                        <Label>值</Label>
                                        <Input
                                            value={inp.value}
                                            onChange={(e) => handleInputChange(idx, iIdx, "value", e.target.value)}
                                            placeholder="参数值"
                                        />
                                    </div>
                                    {iIdx > 0 && (
                                        <Button variant="outline" onClick={() => handleRemoveInput(idx, iIdx)}>
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
    );
}
