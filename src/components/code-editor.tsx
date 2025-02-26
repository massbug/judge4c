"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import normalizeUrl from "normalize-url";
import { highlighter } from "@/lib/shiki";
import { useEffect, useRef } from "react";
import { shikiToMonaco } from "@shikijs/monaco";
import { Skeleton } from "@/components/ui/skeleton";
import { CODE_EDITOR_OPTIONS } from "@/constants/option";
import { DEFAULT_EDITOR_PATH } from "@/config/editor/path";
import { DEFAULT_EDITOR_VALUE } from "@/config/editor/value";
import type { MonacoLanguageClient } from "monaco-languageclient";
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
    loading: () => (
      <div className="h-full w-full p-10 pt-2">
        <Skeleton className="h-full w-full rounded-3xl" />
      </div>
    ),
  }
);

type ConnectionHandle = {
  client: MonacoLanguageClient | null;
  socket: WebSocket | null;
  controller: AbortController;
};

export default function CodeEditor() {
  const { resolvedTheme } = useTheme();
  const connectionRef = useRef<ConnectionHandle>({
    client: null,
    socket: null,
    controller: new AbortController(),
  });
  const { fontSize, lineHeight } = useCodeEditorOption();
  const { language, setEditor } = useCodeEditorState();

  useEffect(() => {
    const currentHandle: ConnectionHandle = {
      client: null,
      socket: null,
      controller: new AbortController(),
    };
    const signal = currentHandle.controller.signal;
    connectionRef.current = currentHandle;

    const cleanupConnection = async (handle: ConnectionHandle) => {
      try {
        // Cleanup Language Client
        if (handle.client) {
          console.log("Stopping language client...");
          await handle.client.stop(250).catch(() => { });
          handle.client.dispose();
        }
      } catch (e) {
        console.log("Client cleanup error:", e);
      } finally {
        handle.client = null;
      }

      // Cleanup WebSocket
      if (handle.socket) {
        console.log("Closing WebSocket...");
        const socket = handle.socket;
        socket.onopen = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.onmessage = null;

        try {
          if (
            [WebSocket.OPEN, WebSocket.CONNECTING].includes(
              socket.readyState as WebSocket["OPEN"] | WebSocket["CONNECTING"]
            )
          ) {
            socket.close(1000, "Connection replaced");
          }
        } catch (e) {
          console.log("Socket close error:", e);
        } finally {
          handle.socket = null;
        }
      }
    };

    const initialize = async () => {
      try {
        // Cleanup old connection
        await cleanupConnection(connectionRef.current);

        const serverConfig = SUPPORTED_LANGUAGE_SERVERS.find((s) => s.id === language);
        if (!serverConfig || signal.aborted) return;

        // Create WebSocket connection
        const lspUrl = `${serverConfig.protocol}://${serverConfig.hostname}${serverConfig.port ? `:${serverConfig.port}` : ""
          }${serverConfig.path || ""}`;
        const webSocket = new WebSocket(normalizeUrl(lspUrl));
        currentHandle.socket = webSocket;

        // Wait for connection to establish or timeout
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            webSocket.onopen = () => {
              if (signal.aborted) reject(new Error("Connection aborted"));
              else resolve();
            };
            webSocket.onerror = () => reject(new Error("WebSocket error"));
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000)),
        ]);

        if (signal.aborted) {
          webSocket.close(1001, "Connection aborted");
          return;
        }

        // Initialize Language Client
        const { MonacoLanguageClient } = await import("monaco-languageclient");
        const { ErrorAction, CloseAction } = await import("vscode-languageclient");

        const socket = toSocket(webSocket);
        const client = new MonacoLanguageClient({
          name: `${serverConfig.label} Client`,
          clientOptions: {
            documentSelector: [serverConfig.id],
            errorHandler: {
              error: () => ({ action: ErrorAction.Continue }),
              closed: () => ({ action: CloseAction.DoNotRestart }),
            },
          },
          connectionProvider: {
            get: () =>
              Promise.resolve({
                reader: new WebSocketMessageReader(socket),
                writer: new WebSocketMessageWriter(socket),
              }),
          },
        });

        client.start();
        currentHandle.client = client;

        // Bind WebSocket close event
        webSocket.onclose = (event) => {
          if (!signal.aborted) {
            console.log("WebSocket closed:", event);
            client.stop();
          }
        };
      } catch (error) {
        if (!signal.aborted) {
          console.error("Connection failed:", error);
        }
        cleanupConnection(currentHandle);
      }
    };

    initialize();

    return () => {
      console.log("Cleanup triggered");
      currentHandle.controller.abort();
      cleanupConnection(currentHandle);
    };
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
