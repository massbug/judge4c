import normalizeUrl from "normalize-url";
import type { MessageTransports } from "vscode-languageclient";
import type { MonacoLanguageClient } from "monaco-languageclient";
import { EditorLanguageConfig, LanguageServerConfig } from "@prisma/client";
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";

// Create the WebSocket URL based on the protocol and port
function createUrl(languageServerConfig: LanguageServerConfig): string {
  return normalizeUrl(
    `${languageServerConfig.protocol}://${languageServerConfig.hostname}${languageServerConfig.port ? `:${languageServerConfig.port}` : ""
    }${languageServerConfig.path || ""}`
  );
}

// Create the language client with the given transports
async function createLanguageClient(
  transports: MessageTransports,
  editorLanguageConfig: EditorLanguageConfig
): Promise<MonacoLanguageClient> {
  const { MonacoLanguageClient } = await import("monaco-languageclient");
  const { CloseAction, ErrorAction } = await import("vscode-languageclient");

  return new MonacoLanguageClient({
    name: `${editorLanguageConfig.label} Language Client`,
    clientOptions: {
      // use a language id as a document selector
      documentSelector: [editorLanguageConfig.language],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart }),
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => Promise.resolve(transports),
    },
  });
}

// Connect to the WebSocket and create the language client
export function connectToLanguageServer(
  editorLanguageConfig: EditorLanguageConfig,
  languageServerConfig: LanguageServerConfig
): Promise<{ client: MonacoLanguageClient; webSocket: WebSocket }> {
  const url = createUrl(languageServerConfig);
  const webSocket = new WebSocket(url);

  return new Promise((resolve, reject) => {
    // Handle the WebSocket opening event
    webSocket.onopen = async () => {
      const socket = toSocket(webSocket);
      const reader = new WebSocketMessageReader(socket);
      const writer = new WebSocketMessageWriter(socket);

      try {
        const languageClient = await createLanguageClient(
          { reader, writer },
          editorLanguageConfig
        );

        // Start the language client
        languageClient.start();

        // Stop the language client when the reader closes
        reader.onClose(() => languageClient.stop());

        resolve({ client: languageClient, webSocket });
      } catch (error) {
        reject(error);
      }
    };

    // Handle WebSocket errors
    webSocket.onerror = (error) => {
      reject(error);
    };
  });
}
