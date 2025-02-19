# monaco-editor-lsp-next

A demo project demonstrating LSP integration using Nextjs + @monaco-editor/react + monaco-languageclient.

## Quick Start

1. **Start LSP Containers**
   ```bash
   cd docker
   docker compose up -d
   cd ..
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Start Development Server**
   ```bash
   bun run dev
   ```

## LSP Configuration

The project includes preconfigured LSP servers for:
- C (port 4594)
- C++ (port 4595)

Using [jsonrpc-ws-proxy](https://github.com/wylieconlon/jsonrpc-ws-proxy) to bridge Monaco Editor with clangd.
