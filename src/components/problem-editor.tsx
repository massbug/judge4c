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

export function ProblemEditor() {
  const {
    hydrated,
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

  // Connect to LSP only if enabled
  const connectLSP = useCallback(async () => {
    if (!(currentLang && editor)) return;

    // If there's an existing language client, stop it first
    if (monacoLanguageClientRef.current) {
      monacoLanguageClientRef.current.stop();
      monacoLanguageClientRef.current = null;
      setWebSocket(null);
    }

    if (!currentEditorLanguageConfig || !currentLanguageServerConfig) return;

    // Create a new language client
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

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        changeValue(value);
      }
    },
    [changeValue]
  );

  const handleEditorValidation = useCallback(
    (markers: editor.IMarker[]) => {
      setMarkers(markers);
    },
    [setMarkers]
  );

  if (!hydrated) {
    return <Loading />;
  }

  return (
    <Editor
      language={currentLang}
      theme={currentTheme}
      path={currentPath}
      value={currentValue}
      beforeMount={handleEditorWillMount}
      onMount={handleOnMount}
      onChange={handleEditorChange}
      onValidate={handleEditorValidation}
      options={DefaultEditorOptionConfig}
      loading={<Loading />}
      className="h-full w-full"
    />
  );
}
