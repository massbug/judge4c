"use client";

import { TooltipButton } from "@/components/tooltip-button";
import { ArrowLeftRight, LoaderCircleIcon, Undo2Icon } from "lucide-react";
import { useProblemEditorStore } from "@/stores/problem-editor";

export const AIDisplayButton = () => {
    const { useAIEditor, setUseAIEditor,setAIgenerate ,loading } = useProblemEditorStore();

    const handleClick = () => {
        setAIgenerate(false);
        if (!loading) {
            setUseAIEditor(!useAIEditor);
        }
    };

    const tooltipContent = loading
        ? "AI 正在优化中…"
        : useAIEditor
            ? "返回原始编辑器"
            : "查看 AI 优化代码";

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
            )
                : (
                <ArrowLeftRight size={16} strokeWidth={2} aria-hidden="true" />
            )
            }
        </TooltipButton>
    );
};
