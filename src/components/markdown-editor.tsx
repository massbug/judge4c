"use client";

import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { highlighter } from "@/lib/shiki";
import type { editor } from "monaco-editor";
import { Loading } from "@/components/loading";
import { shikiToMonaco } from "@shikijs/monaco";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { Editor, type Monaco } from "@monaco-editor/react";
import { DefaultEditorOptionConfig } from "@/config/editor-option";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  className,
}: MarkdownEditorProps) {
  const { currentTheme } = useMonacoTheme();

  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    shikiToMonaco(highlighter, monaco);
  }, []);

  return (
    <Editor
      language="markdown"
      theme={currentTheme}
      value={value}
      beforeMount={handleEditorWillMount}
      onChange={onChange}
      options={DefaultEditorOptionConfig}
      loading={<Loading />}
      className={cn("h-full w-full", className)}
    />
  );
}
