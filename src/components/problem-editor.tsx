"use client";

import dynamic from "next/dynamic";
import { highlighter } from "@/lib/shiki";
import type { editor } from "monaco-editor";
import { Loading } from "@/components/loading";
import { shikiToMonaco } from "@shikijs/monaco";
import type { Monaco } from "@monaco-editor/react";
import { useProblemEditor } from "@/hooks/use-problem-editor";
import { DefaultEditorOptionConfig } from "@/config/editor-option";

// Dynamically import Monaco Editor with SSR disabled
const Editor = dynamic(
  async () => {
    await import("vscode");
    const monaco = await import("monaco-editor");
    const { loader } = await import("@monaco-editor/react");
    loader.config({ monaco });
    return (await import("@monaco-editor/react")).Editor;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export function CodeEditor() {

  const { setEditor, currentLang, currentPath, currentTheme, currentValue, changeValue } = useProblemEditor();

  const handleBeforeMount = (monaco: Monaco) => {
    shikiToMonaco(highlighter, monaco);
  };

  const handleOnMount = (editor: editor.IStandaloneCodeEditor) => {
    setEditor(editor);
  }

  const handleOnChange = (value: string | undefined) => {
    if (value === undefined) return;
    changeValue(value);
  };

  return (
    <Editor
      language={currentLang}
      theme={currentTheme}
      path={currentPath}
      value={currentValue}
      beforeMount={handleBeforeMount}
      onMount={handleOnMount}
      onChange={handleOnChange}
      options={DefaultEditorOptionConfig}
      loading={<Loading />}
      className="h-full w-full py-2"
    />
  );
}
