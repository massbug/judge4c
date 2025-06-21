"use client";

import { useEffect } from "react";
import { CoreEditor } from "@/components/core-editor";
import { useProblemEditorStore } from "@/stores/problem-editor";
import type { LanguageServerConfig, Template } from "@/generated/client";
import { AIEditorWrapper } from "@/components/ai-optimized-editor";

interface ProblemEditorProps {
    problemId: string;
    templates: Template[];
    languageServerConfigs?: LanguageServerConfig[];
}

export const ProblemEditor = ({
                                  problemId,
                                  templates,
                                  languageServerConfigs,
                              }: ProblemEditorProps) => {
    const {
        language,
        value,
        path,
        setProblem,
        setValue,
        setEditor,
        setLspWebSocket,
        setMarkers,
        useAIEditor,
        // setUseAIEditor
    } = useProblemEditorStore();


    useEffect(() => {
        setProblem(problemId, templates);
    }, [problemId, setProblem, templates]);

    return (
        <div className="w-full h-[85vh] relative">
            {!useAIEditor ? (
                <>
                    {/*<button*/}
                    {/*    className="absolute right-4 top-4 bg-blue-600 text-white px-3 py-1 rounded z-10"*/}
                    {/*    onClick={() => setUseAIEditor(true)}*/}
                    {/*>*/}
                    {/*    AI 优化代码*/}
                    {/*</button>*/}
                    <CoreEditor
                        language={language}
                        value={value}
                        path={path}
                        languageServerConfigs={languageServerConfigs}
                        onEditorReady={setEditor}
                        onLspWebSocketReady={setLspWebSocket}
                        onMarkersReady={setMarkers}
                        onChange={setValue}
                        className="h-[80vh] w-full"
                    />
                </>
            ) : (
                <AIEditorWrapper/>
            )}
        </div>
    );
};
