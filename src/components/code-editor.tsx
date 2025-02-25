"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import normalizeUrl from "normalize-url";
import { highlighter } from "@/lib/shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { Skeleton } from "@/components/ui/skeleton";
import { CODE_EDITOR_OPTIONS } from "@/constants/option";
import { DEFAULT_EDITOR_PATH } from "@/config/editor/path";
import { DEFAULT_EDITOR_VALUE } from "@/config/editor/value";
import { SUPPORTED_LANGUAGE_SERVERS } from "@/config/lsp/language-server";
import { useCodeEditorOption, useCodeEditorState } from "@/store/useCodeEditor";
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";

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
    loading: () => <Skeleton className="h-full w-full" />,
  }
);

export default function CodeEditor() {
  const { resolvedTheme } = useTheme();
  const { fontSize, lineHeight } = useCodeEditorOption();
  const { language, languageClient, setEditor, setLanguageClient } = useCodeEditorState();

  useEffect(() => {
    if (languageClient) {
      languageClient.dispose();
      setLanguageClient(null);
    }

    const serverConfig = SUPPORTED_LANGUAGE_SERVERS.find((s) => s.id === language);

    if (serverConfig) {
      const lspUrl = `${serverConfig.protocol}://${serverConfig.hostname}${serverConfig.port ? `:${serverConfig.port}` : ""
        }${serverConfig.path || ""}`;
      const url = normalizeUrl(lspUrl);
      const webSocket = new WebSocket(url);

      webSocket.onopen = async () => {
        const socket = toSocket(webSocket);
        const reader = new WebSocketMessageReader(socket);
        const writer = new WebSocketMessageWriter(socket);

        const { MonacoLanguageClient } = await import("monaco-languageclient");
        const { ErrorAction, CloseAction } = await import("vscode-languageclient");

        const languageClient = new MonacoLanguageClient({
          name: `${serverConfig.label} Language Client`,
          clientOptions: {
            documentSelector: [serverConfig.id],
            errorHandler: {
              error: () => ({ action: ErrorAction.Continue }),
              closed: () => ({ action: CloseAction.DoNotRestart }),
            },
          },
          connectionProvider: {
            get: () => Promise.resolve({ reader, writer }),
          },
        });

        languageClient.start();
        reader.onClose(() => languageClient.stop());

        setLanguageClient(languageClient);
      };

      webSocket.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };

      webSocket.onclose = (event) => {
        console.log("WebSocket closed:", event);
      };

      return () => {
        webSocket.close();
      };
    }
  }, [language]);

  const mergeOptions = {
    ...CODE_EDITOR_OPTIONS,
    fontSize,
    lineHeight,
  };

  return (
    <Editor
      defaultLanguage={language}
      defaultValue={DEFAULT_EDITOR_VALUE[language]}
      path={DEFAULT_EDITOR_PATH[language]}
      theme={resolvedTheme === "light" ? "github-light-default" : "github-dark-default"}
      className="h-full"
      options={mergeOptions}
      beforeMount={(monaco) => {
        shikiToMonaco(highlighter, monaco);
      }}
      onMount={(editor) => {
        setEditor(editor);
      }}
      // onValidate={(markers) => {
      //   markers.forEach((marker) => {
      //     console.log(marker.severity);
      //     console.log(marker.startLineNumber);
      //     console.log(marker.startColumn);
      //     console.log(marker.endLineNumber);
      //     console.log(marker.endColumn);
      //     console.log(marker.message);
      //   });
      // }}
      loading={<Skeleton className="h-full w-full" />}
    />
  );
}
