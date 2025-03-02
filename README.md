<div align="center">

# monaco-editor-lsp-next

✨ A seamless Next.js integration of the Monaco Editor with robust LSP support – all without SSR hassles.

![demo](demo.png)

</div>

## ⚠️ Important Notice for WSL Users

### 🐧 WSL Network Configuration

If you are using Windows Subsystem for Linux (WSL), it is **essential** to switch your network mode to **Mirrored**. Failing to do so may prevent the Monaco Editor from connecting to the LSP language servers due to potential IPv6 configuration conflicts.

#### Steps to Switch to "Mirrored" Mode:
1. Open your WSL settings. ⚙️  
2. Navigate to the **Network** section. 🌐  
3. Change the network mode to **Mirrored**. 🔄  
4. Restart WSL. 💻  

Once these steps are completed, the Monaco Editor should connect smoothly to the LSP language servers. Enjoy! 🎉

## 🚀 Quick Start Guide

### 🐳 Using Docker (Recommended)

```sh
# Clone the repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Build and start containers in detached mode
docker compose up -d --build
```

### 🔧 Manual Setup

```sh
# Clone the repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Build and start specific containers (lsp-c and lsp-cpp) in detached mode
docker compose up -d --build lsp-c lsp-cpp

# Install project dependencies using the Bun package manager
bun install

# Launch the development server
bun run dev
```

## ⚙️ Configuration

### LSP Server Settings

| **Language** | **LSP Server** | **Port** |
|--------------|----------------|----------|
| `C`          | `clangd`       | `4594`   |
| `C++`        | `clangd`       | `4595`   |

## 📦 Package Compatibility

### 🎨 Shiki API Deprecation Notice

The syntax highlighting feature relies on `rehype-pretty-code`, which uses the deprecated `getHighlighter` API from `shiki`. This API was removed as of `shiki@3.0.0+`.

**Key Details:**
- **Affected Component:** `src/components/mdx-preview.tsx`
- **Dependency Chain:** `rehype-pretty-code` → `shiki@legacy`
- **Version Constraints:**
  ```bash
  "shiki": "<=2.5.0"
  "@shikijs/monaco": "<=2.5.0"
  ```

**Developer Note:**  
Although newer shiki versions (3.0.0+) have introduced `createHighlighter` and `getSingletonHighlighter` APIs, upgrading manually may disrupt functionality until `rehype-pretty-code` adapts to these changes. For updates, please monitor the [rehype-pretty-code repository](https://github.com/atomiks/rehype-pretty-code).
