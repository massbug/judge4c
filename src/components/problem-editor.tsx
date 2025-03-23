"use client";

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
  const {
    hydrated,
    editor,
    setEditor,
    setMonacoLanguageClient,
    currentLang,
    currentPath,
    currentTheme,
    currentValue,
    changeValue,
    currentEditorLanguageConfig,
    currentLanguageServerConfig,
  } = useProblem();

  const monacoLanguageClientRef = useRef<MonacoLanguageClient | null>(null);

  // Connect to LSP only if enabled
  const connectLSP = useCallback(async () => {
    if (!(currentLang && editor)) return;

    // If there's an existing language client, stop it first
    if (monacoLanguageClientRef.current) {
      monacoLanguageClientRef.current.stop();
      monacoLanguageClientRef.current = null;
      setMonacoLanguageClient(null);
    }

    if (!currentEditorLanguageConfig || !currentLanguageServerConfig) return;

    // Create a new language client
    try {
      const monacoLanguageClient = await connectToLanguageServer(
        currentEditorLanguageConfig,
        currentLanguageServerConfig,
      );
      monacoLanguageClientRef.current = monacoLanguageClient;
      setMonacoLanguageClient(monacoLanguageClient);
    } catch (error) {
      console.error("Failed to connect to LSP:", error);
    }
  }, [
    currentEditorLanguageConfig,
    currentLang,
    currentLanguageServerConfig,
    editor,
    setMonacoLanguageClient,
  ]);

  // Reconnect to the LSP whenever language or lspConfig changes
  useEffect(() => {
    connectLSP();
  }, [connectLSP]);

  // Cleanup the LSP connection when the component unmounts
  useEffect(() => {
    return () => {
      if (monacoLanguageClientRef.current) {
        monacoLanguageClientRef.current.stop();
        monacoLanguageClientRef.current = null;
        setMonacoLanguageClient(null);
      }
    };
  }, [setMonacoLanguageClient]);

  if (!hydrated) {
    return <Loading />;
  }

  const handleBeforeMount = (monaco: Monaco) => {
    shikiToMonaco(highlighter, monaco);
  };

  const handleOnMount = async (editor: editor.IStandaloneCodeEditor) => {
    setEditor(editor);
    await connectLSP();
  };

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
