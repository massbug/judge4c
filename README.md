<div align="center">

# monaco-editor-lsp-next

✨ A Next.js integration of Monaco Editor with LSP support, free from SSR issues.

</div>

## 🚀 Quick Start

### 🐳 Using Docker (Recommended)

```sh
# Clone repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Start containers in detached mode
docker compose -f ./docker/compose.yml up -d
```

## 🔧 Development Setup

```sh
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next
docker compose -f ./docker/compose.yml up -d lsp-c lsp-cpp
bun install
bun run dev
```

## ⚙️ Configuration

### LSP Server Settings

|  **Language**  |  **LSP Server**  |  **Port**  |
|----------------|------------------|------------|
| `C`            | `clangd`         | `4594`     |
| `C++`          | `clangd`         | `4595`     |
