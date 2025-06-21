"use client";

import { DiffEditor } from "@monaco-editor/react";
import { optimizeCode } from "@/app/actions/ai-improve";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import React, { useState, useEffect, useCallback } from "react";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const AIEditorWrapper = () => {
  const {
    language,
    value: originalCode,
    setLoading,
    AIgenerate,
    LastOptimizedCode,
    setLastOptimizedCode,
  } = useProblemEditorStore();

  const [optimizedCode, setOptimizedCode] = useState<string>("");
  const { theme } = useMonacoTheme();

  const handleOptimize = useCallback(async () => {
    setLoading(true);
    try {
      const res = await optimizeCode({
        code: originalCode,
        error: "",
        problemId: "",
      });
      setOptimizedCode(res.optimizedCode);
      setLastOptimizedCode(res.optimizedCode);
    } catch (err) {
      console.error("优化失败", err);
      setOptimizedCode("// 优化失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [originalCode, setLoading, setLastOptimizedCode]);

  useEffect(() => {
    if (AIgenerate) {
      handleOptimize();
    } else if (LastOptimizedCode) {
      setOptimizedCode(LastOptimizedCode);
    }
  }, [AIgenerate, LastOptimizedCode, handleOptimize]);

  return (
    <div className="w-full h-[80vh] flex flex-col gap-4">
      {optimizedCode && (
        <div className="flex-1">
          <DiffEditor
            language={language}
            original={originalCode}
            modified={optimizedCode}
            height="100%"
            theme={theme}
            options={{
              readOnly: true,
              renderSideBySide: true,
              automaticLayout: true,
            }}
          />
        </div>
      )}
    </div>
  );
};
