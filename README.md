<div align="center">

# monaco-editor-lsp-next

✨ A Next.js integration of Monaco Editor with LSP support, free from SSR issues.

![demo](demo.png)

</div>

## ⚠️ Important Notice for WSL Users!

If you're using Windows Subsystem for Linux (WSL), it's **crucial** to switch your network mode to "Mirrored".

Otherwise, the Monaco Editor might fail to connect to the LSP language servers.

This is typically due to IPv6 configuration issues.

To change your WSL network mode, follow these steps:

1. Open WSL settings. ⚙️
2. Navigate to the "Network" section. 🌐
3. Change the network mode to "Mirrored". 🔄
4. Restart WSL. 💻

After completing these steps, the Monaco Editor should be able to connect to the LSP language servers without any problems. 🎉

## 🚀 Quick Start

### 🐳 Using Docker (Recommended)

```sh
# Clone repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Start containers in detached mode
docker compose -f ./docker/compose.yml up -d
```

### 🔧 Manual Setup

```sh
# Clone repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Start specific containers (lsp-c and lsp-cpp) in detached mode
docker compose -f ./docker/compose.yml up -d lsp-c lsp-cpp

# Install project dependencies using Bun package manager
bun install

# Run the development server
bun run dev
```

## ⚙️ Configuration

### LSP Server Settings

|  **Language**  |  **LSP Server**  |  **Port**  |
|----------------|------------------|------------|
| `C`            | `clangd`         | `4594`     |
| `C++`          | `clangd`         | `4595`     |
