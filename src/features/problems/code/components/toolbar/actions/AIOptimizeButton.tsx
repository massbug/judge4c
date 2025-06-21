"use client";

import { TooltipButton } from "@/components/tooltip-button";
import { Wand2Icon, LoaderCircleIcon, Undo2Icon } from "lucide-react";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const AIOptimizeButton = () => {
    const { useAIEditor, setUseAIEditor, loading } = useProblemEditorStore();

    const handleClick = () => {
        if (!loading) {
            setUseAIEditor(!useAIEditor);
        }
    };

    const tooltipContent = loading
        ? "AI 正在优化中…"
        : useAIEditor
            ? "返回原始编辑器"
            : "使用 AI 优化代码";

    return (
        <TooltipButton
            tooltipContent={tooltipContent}
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? (
                <LoaderCircleIcon
                    className="opacity-60 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            ) : useAIEditor ? (
                <Undo2Icon size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
                <Wand2Icon size={16} strokeWidth={2} aria-hidden="true" />
            )}
        </TooltipButton>
    );
};
