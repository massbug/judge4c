"use client";

import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";
import { useCallback, useRef } from "react";
import { getHighlighter } from "@/lib/shiki";
import { Loading } from "@/components/loading";
import { shikiToMonaco } from "@shikijs/monaco";
import type { Monaco } from "@monaco-editor/react";
import { DEFAULT_EDITOR_OPTIONS } from "@/config/editor";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";

const MonacoEditor = dynamic(
  async () => {
    const react = await import("@monaco-editor/react");

    return react.DiffEditor;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

interface CoreDiffEditorProps {
  language?: string;
  original?: string;
  modified?: string;
  onEditorReady?: (editor: editor.IStandaloneDiffEditor) => void;
  className?: string;
}

export const CoreDiffEditor = ({
  language,
  original,
  modified,
  onEditorReady,
  className,
}: CoreDiffEditorProps) => {
  const { theme } = useMonacoTheme();

  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    const highlighter = getHighlighter();
    shikiToMonaco(highlighter, monaco);
  }, []);

  const handleOnMount = useCallback(
    (editor: editor.IStandaloneDiffEditor) => {
      editorRef.current = editor;
      onEditorReady?.(editor);
    },
    [onEditorReady]
  );

  return (
    <MonacoEditor
      theme={theme}
      language={language}
      original={original}
      modified={modified}
      beforeMount={handleBeforeMount}
      onMount={handleOnMount}
      options={{ ...DEFAULT_EDITOR_OPTIONS, readOnly: true }}
      loading={<Loading />}
      className={className}
    />
  );
};
