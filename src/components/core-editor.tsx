"use client";

import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import dynamic from "next/dynamic";
import normalizeUrl from "normalize-url";
import type { editor } from "monaco-editor";
import { getHighlighter } from "@/lib/shiki";
import { Loading } from "@/components/loading";
import { shikiToMonaco } from "@shikijs/monaco";
import type { Monaco } from "@monaco-editor/react";
import { DEFAULT_EDITOR_OPTIONS } from "@/config/editor";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { LanguageServerConfig } from "@/generated/client";
import type { MessageTransports } from "vscode-languageclient";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MonacoLanguageClient } from "monaco-languageclient";

const MonacoEditor = dynamic(
  async () => {
    const [react, monaco] = await Promise.all([
      import("@monaco-editor/react"),
      import("monaco-editor"),
      import("vscode"),
    ]);

    self.MonacoEnvironment = {
      getWorker() {
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/editor/editor.worker.js",
            import.meta.url
          )
        );
      },
    };

    react.loader.config({ monaco });

    return react.Editor;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

interface CoreEditorProps {
  language?: string;
  value?: string;
  path?: string;
  languageServerConfigs?: LanguageServerConfig[];
  onEditorReady?: (editor: editor.IStandaloneCodeEditor) => void;
  onLspWebSocketReady?: (lspWebSocket: WebSocket) => void;
  onChange?: (value: string) => void;
  onMarkersReady?: (markers: editor.IMarker[]) => void;
  className?: string;
}

export const CoreEditor = ({
  language,
  value,
  path,
  languageServerConfigs,
  onEditorReady,
  onLspWebSocketReady,
  onChange,
  onMarkersReady,
  className,
}: CoreEditorProps) => {
  const { theme } = useMonacoTheme();

  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const lspClientRef = useRef<MonacoLanguageClient | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);

  const activeLanguageServerConfig = languageServerConfigs?.find(
    (config) => config.language === language
  );

  const connectLanguageServer = useCallback(
    (config: LanguageServerConfig) => {
      const serverUrl = buildLanguageServerUrl(config);
      const webSocket = new WebSocket(serverUrl);

      webSocket.onopen = async () => {
        try {
          const rpcSocket = toSocket(webSocket);
          const reader = new WebSocketMessageReader(rpcSocket);
          const writer = new WebSocketMessageWriter(rpcSocket);

          const transports: MessageTransports = { reader, writer };
          const client = await createLanguageClient(config, transports);
          lspClientRef.current = client;
          await client.start();
        } catch (error) {
          console.error("Failed to initialize language client:", error);
        }

        webSocketRef.current = webSocket;
        onLspWebSocketReady?.(webSocket);
      };
    },
    [onLspWebSocketReady]
  );

  useEffect(() => {
    if (isEditorMounted && activeLanguageServerConfig) {
      connectLanguageServer(activeLanguageServerConfig);
    }

    return () => {
      if (lspClientRef.current) {
        lspClientRef.current.stop();
        lspClientRef.current = null;
      }
    };
  }, [activeLanguageServerConfig, connectLanguageServer, isEditorMounted]);

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    const highlighter = getHighlighter();
    shikiToMonaco(highlighter, monaco);
  }, []);

  const handleOnMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      onEditorReady?.(editor);
      setIsEditorMounted(true);
    },
    [onEditorReady]
  );

  const handleOnChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value ?? "");
    },
    [onChange]
  );

  const handleOnValidate = useCallback(
    (markers: editor.IMarker[]) => {
      onMarkersReady?.(markers);
    },
    [onMarkersReady]
  );

  return (
    <MonacoEditor
      theme={theme}
      language={language}
      value={value}
      path={path}
      beforeMount={handleBeforeMount}
      onMount={handleOnMount}
      onChange={handleOnChange}
      onValidate={handleOnValidate}
      options={DEFAULT_EDITOR_OPTIONS}
      loading={<Loading />}
      className={className}
    />
  );
};

const buildLanguageServerUrl = (config: LanguageServerConfig) => {
  return normalizeUrl(
    `${config.protocol}://${config.hostname}${
      config.port ? `:${config.port}` : ""
    }${config.path ?? ""}`
  );
};

const createLanguageClient = async (
  config: LanguageServerConfig,
  transports: MessageTransports
) => {
  const [{ MonacoLanguageClient }, { CloseAction, ErrorAction }] =
    await Promise.all([
      import("monaco-languageclient"),
      import("vscode-languageclient"),
    ]);

  return new MonacoLanguageClient({
    name: `${config.language} language client`,
    clientOptions: {
      documentSelector: [config.language],
      errorHandler: {
        error: (error, message, count) => {
          console.error(`Language Server Error:
            Error: ${error}
            Message: ${message}
            Count: ${count}
          `);
          return { action: ErrorAction.Continue };
        },
        closed: () => ({ action: CloseAction.DoNotRestart }),
      },
    },
    connectionProvider: {
      get: () => Promise.resolve(transports),
    },
  });
};
