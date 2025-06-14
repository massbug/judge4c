"use client";

import { useCallback, useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { optimizeCode } from "@/app/actions/ai-improve";
import type { OptimizeCodeInput } from "@/types/ai-improve";
import { CoreEditor } from "./core-editor"; // 引入你刚刚的组件
// import { Loading } from "@/components/loading";
import type { LanguageServerConfig } from "@/generated/client";

interface AIEditorWrapperProps {
  language?: string;
  value?: string;
  path?: string;
  problemId?: string;
  languageServerConfigs?: LanguageServerConfig[];
  onChange?: (value: string) => void;
  className?: string;
}

export const AIEditorWrapper = ({
                                  language,
                                  value,
                                  path,
                                  problemId,
                                  languageServerConfigs,
                                  onChange,
                                  // className,
                                }: AIEditorWrapperProps) => {
  const [currentCode, setCurrentCode] = useState(value ?? "");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const handleCodeChange = useCallback((val: string) => {
    setCurrentCode(val);
    onChange?.(val);
  }, [onChange]);

  const handleOptimize = useCallback(async () => {
    if (!problemId || !currentCode) return;
    setIsOptimizing(true);
    setError(null);

    try {
      const input: OptimizeCodeInput = {
        code: currentCode,
        problemId,
      };
      const result = await optimizeCode(input);
      setOptimizedCode(result.optimizedCode);
      setShowDiff(true);
    } catch (err) {
      setError("AI 优化失败，请稍后重试");
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  }, [currentCode, problemId]);

  const handleApplyOptimized = useCallback(() => {
    setCurrentCode(optimizedCode);
    onChange?.(optimizedCode);
    setShowDiff(false);
  }, [optimizedCode, onChange]);

  return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between p-4">
          <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {isOptimizing ? "优化中..." : "AI优化代码"}
          </button>

          {showDiff && (
              <div className="space-x-2">
                <button
                    onClick={() => setShowDiff(false)}
                    className="px-4 py-2 bg-secondary text-white rounded"
                >
                  隐藏对比
                </button>
                <button
                    onClick={handleApplyOptimized}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  应用优化结果
                </button>
              </div>
          )}
        </div>

        {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>
        )}

        <div className="flex-grow overflow-hidden">
          {showDiff ? (
              <DiffEditor
                  original={currentCode}
                  modified={optimizedCode}
                  language={language}
                  theme="vs-dark"
                  className="h-full w-full"
                  options={{ readOnly: true, minimap: { enabled: false } }}
              />
          ) : (
              <CoreEditor
                  language={language}
                  value={currentCode}
                  path={path}
                  languageServerConfigs={languageServerConfigs}
                  onChange={handleCodeChange}
                  className="h-full w-full"
              />
          )}
        </div>
      </div>
  );
};
