"use client";

import { useState, useCallback } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { optimizeCode } from "@/actions/ai-improve";
import { OptimizeCodeInput } from "@/types/ai-improve";
import { Loading } from "@/components/loading";
import dynamic from "next/dynamic";

// 动态导入Monaco Editor
const Editor = dynamic(
  async () => {
    await import("vscode");
    const monaco = await import("monaco-editor");

    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "json") {
          return new Worker(
            new URL("monaco-editor/esm/vs/language/json/json.worker.js", import.meta.url)
          );
        }
        if (label === "css" || label === "scss" || label === "less") {
          return new Worker(
            new URL("monaco-editor/esm/vs/language/css/css.worker.js", import.meta.url)
          );
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return new Worker(
            new URL("monaco-editor/esm/vs/language/html/html.worker.js", import.meta.url)
          );
        }
        if (label === "typescript" || label === "javascript") {
          return new Worker(
            new URL("monaco-editor/esm/vs/language/typescript/ts.worker.js", import.meta.url)
          );
        }
        return new Worker(
          new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url)
        );
      },
    };
    const { loader } = await import("@monaco-editor/react");
    loader.config({ monaco });
    return (await import("@monaco-editor/react")).Editor;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export function AIProblemEditor({
  initialCode = "",
  problemId = "",
  onCodeChange
}: {
  initialCode?: string;
  problemId?: string;
  onCodeChange?: (code: string) => void;
}) {
  const [showDiff, setShowDiff] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCurrentCode(value);
      if (onCodeChange) {
        onCodeChange(value);
      }
    }
  }, [onCodeChange]);

  const handleOptimizeCode = useCallback(async () => {
    if (!currentCode || !problemId) return;

    setIsOptimizing(true);
    setError(null);

    try {
      const input: OptimizeCodeInput = {
        code: currentCode,
        problemId
      };

      const result = await optimizeCode(input);
      setOptimizedCode(result.optimizedCode);
      setShowDiff(true);
    } catch (err) {
      setError("代码优化失败，请重试");
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  }, [currentCode, problemId]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4">
        <button
          onClick={handleOptimizeCode}
          disabled={isOptimizing || !currentCode}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {isOptimizing ? "优化中..." : "AI优化代码"}
        </button>
        
        {showDiff && (
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          >
            {"隐藏对比"}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="flex-grow overflow-hidden">
        {showDiff ? (
          <DiffEditor
            original={currentCode}
            modified={optimizedCode}
            language="typescript"
            theme="vs-dark"
            className="h-full w-full"
            options={{
              readOnly: true,
              minimap: { enabled: false }
            }}
          />
        ) : (
          <Editor
            language="typescript"
            theme="vs-dark"
            value={currentCode}
            onChange={handleCodeChange}
            options={{
              scrollBeyondLastLine: false,
              fontSize: 14
            }}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}