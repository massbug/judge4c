"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import normalizeUrl from "normalize-url";
import { highlighter } from "@/lib/shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { Skeleton } from "@/components/ui/skeleton";
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";

const DynamicEditor = dynamic(
  async () => {
    await import("vscode");

    const monaco = await import("monaco-editor");
    const { loader, Editor } = await import("@monaco-editor/react");

    loader.config({ monaco });

    return Editor;
  },
  { ssr: false }
);

export default function CodeEditor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const url = normalizeUrl("ws://localhost:4594/clangd");
    const webSocket = new WebSocket(url);

    webSocket.onopen = async () => {
      const socket = toSocket(webSocket);
      const reader = new WebSocketMessageReader(socket);
      const writer = new WebSocketMessageWriter(socket);

      const { MonacoLanguageClient } = await import("monaco-languageclient");
      const { ErrorAction, CloseAction } = await import("vscode-languageclient");

      const languageClient = new MonacoLanguageClient({
        name: "C Language Client",
        clientOptions: {
          documentSelector: ["c"],
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
  }, []);

  return (
    <DynamicEditor
      defaultLanguage="c"
      defaultValue="# include<stdio.h>"
      path="file:///main.c"
      theme={
        resolvedTheme === "light"
          ? "github-light-default"
          : "github-dark-default"
      }
      height="100%"
      options={{ automaticLayout: true }}
      beforeMount={(monaco) => {
        shikiToMonaco(highlighter, monaco);
      }}
      onValidate={(markers) => {
        markers.forEach((marker) =>
          console.log("onValidate:", marker.message)
        );
      }}
      loading={<Skeleton className="h-full w-full" />}
    />
  );
}
