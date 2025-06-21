"use client";

import React, { useState, useEffect } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { optimizeCode } from "@/app/actions/ai-improve";
import { AIOptimizeButton } from "@/features/problems/code/components/toolbar/actions/AIOptimizeButton";

interface AIEditorWrapperProps {
    language: string;
    originalCode: string;
    onReset: () => void;
}

export const AIEditorWrapper = ({ language, originalCode, onReset }: AIEditorWrapperProps) => {
    const [optimizedCode, setOptimizedCode] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const { theme } = useMonacoTheme();

    // 自动在组件首次挂载后执行 AI 优化
    useEffect(() => {
        if (!optimizedCode) {
            handleOptimize();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOptimize = async () => {
        setLoading(true);
        try {
            const res = await optimizeCode({
                code: originalCode,
                error: "",
                problemId: "",
            });
            setOptimizedCode(res.optimizedCode);
        } catch (err) {
            console.error("优化失败", err);
            setOptimizedCode("// 优化失败，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (optimizedCode) {
            // 已有优化，点击返回
            setOptimizedCode("");
            onReset();
        } else {
            // 手动触发优化（如果需要）
            handleOptimize();
        }
    };

    return (
        <div className="w-full h-[80vh] flex flex-col gap-4">
            <div>
                <AIOptimizeButton
                    loading={loading}
                    hasOptimized={!!optimizedCode}
                    onClick={handleClick}
                />
            </div>

            {optimizedCode && (
                <div className="flex-1">
                    <DiffEditor
                        language={language}
                        original={originalCode}
                        modified={optimizedCode}
                        height="100%"
                        theme={theme}
                        options={{ readOnly: true, renderSideBySide: true, automaticLayout: true }}
                    />
                </div>
            )}
        </div>
    );
};
