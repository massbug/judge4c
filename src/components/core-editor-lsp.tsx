"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";
import { highlighter } from "@/lib/shiki";
import type { editor } from "monaco-editor";
import { shikiToMonaco } from "@shikijs/monaco";
import type { Monaco } from "@monaco-editor/react";
import { useCallback, useEffect, useRef } from "react";
import { connectToLanguageServer } from "@/lib/language-server";
import { LanguageServerMetadata } from "@/types/language-server";
import type { MonacoLanguageClient } from "monaco-languageclient";

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
    loading: () => (
      <div className="h-full w-full p-2">
        <Skeleton className="h-full w-full rounded-3xl" />
      </div>
    ),
  }
);

interface CoreEditorLspProps {
  language?: string;
  theme?: string;
  path?: string;
  value?: string;
  className?: string;
  lspConfig?: LanguageServerMetadata;
  editorConfig?: editor.IEditorConstructionOptions;
  enableLSP?: boolean;
}

export default function CoreEditorLsp({
  language,
  theme,
  path,
  value,
  className,
  lspConfig,
  editorConfig,
  enableLSP = true,
}: CoreEditorLspProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoLanguageClientRef = useRef<MonacoLanguageClient | null>(null);

  // Connect to LSP only if enabled
  const connectLSP = useCallback(async () => {
    if (!enableLSP || !language || !lspConfig || !editorRef.current) return;

    // If there's an existing language client, stop it first
    if (monacoLanguageClientRef.current) {
      monacoLanguageClientRef.current.stop();
      monacoLanguageClientRef.current = null;
    }

    // Create a new language client
    try {
      const monacoLanguageClient = await connectToLanguageServer(
        lspConfig.protocol,
        lspConfig.hostname,
        lspConfig.port,
        lspConfig.path,
        lspConfig.lang
      );
      monacoLanguageClientRef.current = monacoLanguageClient;
    } catch (error) {
      console.error("Failed to connect to LSP:", error);
    }
  }, [language, lspConfig, enableLSP]);

  // Connect to LSP once the editor has mounted
  const handleEditorDidMount = useCallback(
    async (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      await connectLSP();
    },
    [connectLSP]
  );

  // Reconnect to the LSP whenever language or lspConfig changes
  useEffect(() => {
    connectLSP();
  }, [lspConfig, language, connectLSP]);

  // Cleanup the LSP connection when the component unmounts
  useEffect(() => {
    return () => {
      if (monacoLanguageClientRef.current) {
        monacoLanguageClientRef.current.stop();
        monacoLanguageClientRef.current = null;
      }
    };
  }, []);

  function handleEditorWillMount(monaco: Monaco) {
    shikiToMonaco(highlighter, monaco);
  }

  return (
    <Editor
      language={language}
      theme={theme}
      path={path}
      value={value}
      className={className}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      options={editorConfig}
      loading={
        <div className="h-full w-full p-2">
          <Skeleton className="h-full w-full rounded-3xl" />
        </div>
      }
    />
  );
}
