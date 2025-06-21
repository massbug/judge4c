"use client";

import { TooltipButton } from "@/components/tooltip-button";
import { Wand2Icon } from "lucide-react";
//import { LoaderCircleIcon, Undo2Icon } from "lucide-react";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const AIOptimizeButton = () => {
    const { useAIEditor, setUseAIEditor, setAIgenerate, loading } = useProblemEditorStore();

    const handleClick = () => {
        setAIgenerate(true);
        if (!loading) {
            setUseAIEditor(!useAIEditor);
        }
    };

    //     ? "AI 正在优化中…"
    //     : useAIEditor
    //         ? "返回原始编辑器"
    //         : "使用 AI 优化代码";

    const tooltipContent = "使用 AI 优化代码"; // 仅保留默认提示内容

    return (
        <TooltipButton
            tooltipContent={tooltipContent}
            onClick={handleClick}
            disabled={loading || useAIEditor}
        >
            {
                loading ? (
                // <LoaderCircleIcon
                //     className="opacity-60 animate-spin"
                //     size={16}
                //     strokeWidth={2}
                //     aria-hidden="true"
                // />
                    null
            ) : useAIEditor ? (
                // <Undo2Icon size={16} strokeWidth={2} aria-hidden="true" />
                    null
            ) :
                (
                <Wand2Icon size={16} strokeWidth={2} aria-hidden="true" />
            )}
        </TooltipButton>
    );
};
