"use client";

import { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { optimizeCode } from "@/app/actions/ai-improve";
import { OptimizeCodeInput } from "@/types/ai-improve";
import dynamic from "next/dynamic";
import { highlighter } from "@/lib/shiki";
import type { editor } from "monaco-editor";
import { Loading } from "@/components/loading";
import { shikiToMonaco } from "@shikijs/monaco";
import { useProblem } from "@/hooks/use-problem";
import type { Monaco } from "@monaco-editor/react";
import { useCallback, useEffect, useRef } from "react";
import { connectToLanguageServer } from "@/lib/language-server";
import type { MonacoLanguageClient } from "monaco-languageclient";
import { DefaultEditorOptionConfig } from "@/config/editor-option";

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
    const {
        editor,
        setEditor,
        setMarkers,
        setWebSocket,
        currentLang,
        currentPath,
        currentTheme,
        currentValue,
        changeValue,
        currentEditorLanguageConfig,
        currentLanguageServerConfig,
    } = useProblem();

    const monacoLanguageClientRef = useRef<MonacoLanguageClient | null>(null);

    // 保持原有AI优化的状态
    const [showDiff, setShowDiff] = useState(false);
    const [optimizedCode, setOptimizedCode] = useState("");
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 重用useProblem的状态管理
    const currentCode = currentValue || initialCode;

    const handleCodeChange = useCallback((value: string | undefined) => {
        if (value !== undefined) {
            changeValue(value);
            if (onCodeChange) {
                onCodeChange(value);
            }
        }
    }, [onCodeChange, changeValue]);

    // 保持原有LSP连接逻辑
    const connectLSP = useCallback(async () => {
        if (!(currentLang && editor)) return;

        if (monacoLanguageClientRef.current) {
            monacoLanguageClientRef.current.stop();
            monacoLanguageClientRef.current = null;
            setWebSocket(null);
        }

        if (!currentEditorLanguageConfig || !currentLanguageServerConfig) return;

        try {
            const { client: monacoLanguageClient, webSocket } = await connectToLanguageServer(
                currentEditorLanguageConfig,
                currentLanguageServerConfig
            );
            monacoLanguageClientRef.current = monacoLanguageClient;
            setWebSocket(webSocket);
        } catch (error) {
            console.error("Failed to connect to LSP:", error);
        }
    }, [
        currentEditorLanguageConfig,
        currentLang,
        currentLanguageServerConfig,
        editor,
        setWebSocket,
    ]);

    useEffect(() => {
        connectLSP();
    }, [connectLSP]);

    useEffect(() => {
        return () => {
            if (monacoLanguageClientRef.current) {
                monacoLanguageClientRef.current.stop();
                monacoLanguageClientRef.current = null;
                setWebSocket(null);
            }
        };
    }, [setWebSocket]);

    const handleEditorWillMount = useCallback((monaco: Monaco) => {
        shikiToMonaco(highlighter, monaco);
    }, []);

    const handleOnMount = useCallback(
        async (editor: editor.IStandaloneCodeEditor) => {
            setEditor(editor);
            await connectLSP();
        },
        [setEditor, connectLSP]
    );

    const handleEditorValidation = useCallback(
        (markers: editor.IMarker[]) => {
            setMarkers(markers);
        },
        [setMarkers]
    );

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
            {/* 保持原有AI优化按钮 */}
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
                        language={currentLang}
                        theme={currentTheme}
                        className="h-full w-full"
                        options={{
                            readOnly: true,
                            minimap: { enabled: false }
                        }}
                    />
                ) : (
                    <Editor
                        language={currentLang}
                        theme={currentTheme}
                        path={currentPath}
                        value={currentCode}
                        beforeMount={handleEditorWillMount}
                        onMount={handleOnMount}
                        onChange={handleCodeChange}
                        onValidate={handleEditorValidation}
                        options={DefaultEditorOptionConfig}
                        loading={<Loading />}
                        className="h-full w-full"
                    />
                )}
            </div>
        </div>
    );
}