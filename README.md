<div align="center">

# monaco-editor-lsp-next

✨ A seamless Next.js integration of the Monaco Editor with robust LSP support – all without SSR hassles.

![demo](demo.png)

</div>

## ⚠️ WSL Users: Critical Configuration

### 🐧 Network Mode Requirement

When using Windows Subsystem for Linux (WSL), you **must** configure your network mode as **Mirrored** to ensure proper LSP server connectivity. Standard WSL network configurations may create IPv6 conflicts that block Monaco-LSP communication.

#### 🔧 Mirror Mode Setup:
1. Open WSL settings ⚙️  
2. Navigate to **Network** section 🌐  
3. Select **Mirrored** mode 🔄  
4. Restart WSL instance 💻  

Complete these steps before launching the editor for seamless LSP integration! 🎉

## 🚀 Getting Started

### 🐳 Docker Deployment (Recommended)

Deploy the project quickly using pre-built Docker images:  

```sh
# Clone the repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Start the application with pre-built images
docker compose up -d
```

### 🔨 Local Manual Build

Build the images locally and start the containers:  

```sh
# Clone the repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Build and start containers using the local configuration
docker compose -f compose.local.yml up -d --build
```

### 🛠 Development Mode

Set up a development environment with hot-reloading:  

```sh
# Clone the repository
git clone https://github.com/cfngc4594/monaco-editor-lsp-next
cd monaco-editor-lsp-next

# Start only the LSP containers
docker compose up -d lsp-c lsp-cpp
# Or use the local configuration
# docker compose -f compose.local.yml up -d --build lsp-c lsp-cpp

# Install dependencies and start the development server
bun install
bun run dev
```

## ⚙️ Technical Configuration

### LSP Server Mapping

| **Language** | **LSP Server** | **Port** |
|--------------|----------------|----------|
| `C`          | `clangd`       | `4594`   |
| `C++`        | `clangd`       | `4595`   |

## 📦 Dependency Management

### 🔒 Version Lock Requirements

**Critical Pairing**:  
| Package                 | Max Version | Reference |  
|-------------------------|-------------|-----------|  
| `monaco-editor`         | ≤0.36.1     | [Compatibility Matrix](https://github.com/TypeFox/monaco-languageclient/blob/main/docs/versions-and-history.md#monaco-editor--codingamemonaco-vscode-api-compatibility-table) |  
| `monaco-languageclient` | ≤5.0.1      |           |  

**Version Lock Rationale**:  
1. **API Stability**  
   - Newer `monaco-editor` (≥0.40.0) breaks `monaco-languageclient` integration  
   - v0.36.1 matches `@codingame/monaco-vscode-api@1.76.9` requirements  

2. **LSP Feature Breakdown**  
   - Version mismatches disable:  
     - Auto `textDocument/didOpen` events  
     - `textDocument/inlayHint` resolution  
     - `textDocument/documentLink` functionality  

3. **Version Conflict**  
   - `@codingame` package versioning (e.g., `11.1.2`) ≠ `monaco-editor` versions (e.g., `0.36.1`)  
   - `@monaco-editor/react` depends on `monaco-editor` versioning scheme  

**Failure Indicators**:  
- ✔️ WebSocket connection established  
- ❌ Missing syntax highlighting  
- ❌ No autocomplete suggestions  
- ❌ Silent LSP initialization failures  

### 🎨 Shiki Compatibility Notice

Syntax highlighting depends on `rehype-pretty-code`'s deprecated `getHighlighter` API from `shiki@legacy`.

**Key Points**:

- **Affected File:** `src/components/mdx-preview.tsx`
- **Dependency Chain:** `rehype-pretty-code` → `shiki@legacy`
- **Version Constraints**:

  ```sh
  "shiki": "<=2.5.0"
  "@shikijs/monaco": "<=2.5.0"
  ```

**Maintenance Note**:  
While `shiki@3.0.0+` introduces modern APIs (`createHighlighter`/`getSingletonHighlighter`), upgrading requires `rehype-pretty-code` updates. Track progress [here](https://github.com/atomiks/rehype-pretty-code).
