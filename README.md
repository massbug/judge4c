<div align="center">

# Judge4c

✨ A full-stack, open-source online judge platform designed to elevate college programming education.

![demo](demo.png)

</div>

## ⚠️ Network Configuration & Troubleshooting

### 🐧 For WSL Users: Mirrored Network Mode Requirement

When using Windows Subsystem for Linux (WSL), you **must** configure your network mode as **Mirrored** to ensure proper LSP server connectivity. Standard WSL network configurations may create IPv6 conflicts that block Monaco-LSP communication.

#### 🔧 Mirror Mode Setup:

1. Open WSL settings ⚙️
2. Navigate to **Network** section 🌐
3. Select **Mirrored** mode 🔄
4. Restart WSL instance 💻

Complete these steps before launching the editor for seamless LSP integration! 🎉

### 🚨 Troubleshooting: TLS Connection Error Due to Network Proxy

If you encounter the following error:

```pgsql
[Error: Client network socket disconnected before secure TLS connection was established]
```

Please check if a network proxy (e.g., VPN, HTTP/SOCKS proxy, etc.) is enabled on your system and disable it. The active proxy may interfere with the establishment of a secure TLS connection.

## 🚀 Getting Started

### 🐳 Docker Deployment (Recommended)

Quickly deploy the project using Docker with these steps:

```shell
# Clone the repository
git clone https://github.com/massbug/judge4c

# Navigate to project directory
cd judge4c

# Set up environment configuration
cp .env.example .env
# Edit the .env file with your configuration

# Build and start containers in detached mode
docker compose up -d
```

### 🛠️ Local Development Setup

For local development, follow these steps:

#### Step 1: Clone the Repository

```shell
git clone https://github.com/massbug/judge4c
cd judge4c
```

#### Step 2: Install Dependencies

This project uses `bun` as the default package manager, but you can also use other package managers like `npm`, `yarn`, or `pnpm` if you prefer.

If you choose to use a package manager other than `bun`, you should delete the `bun.lock` file from your project directory.

The `Dockerfile` is designed to dynamically detect and adapt to the package manager you are using, ensuring compatibility with your preferred tool.

```shell
bun install
```

#### Step 3: Configure Environment Variables

1. Copy the example environment file:

   ```sh
   cp .env.example .env
   ```

2. Open the `.env` file and set the following variables:

   - **PostgreSQL Credentials**:
     ```sh
     POSTGRES_USER="your_postgres_user"
     POSTGRES_PASSWORD="your_postgres_password"
     POSTGRES_DB="your_postgres_db"
     # POSTGRES_HOST and DATABASE_URL are used for local development.
     # Note: In compose.yml, POSTGRES_HOST is hardcoded as "postgres" and POSTGRES_PORT as "5432".
     # If you need to change them, update the corresponding values in the environment section of compose.yml.
     POSTGRES_HOST="your_postgres_host"
     POSTGRES_PORT="your_postgres_port"
     DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
     ```

   - **Authentication Secret**:
     Generate a secure secret key using:
     ```sh
     bunx auth secret
     ```
     Then, set the `AUTH_SECRET` variable:
     ```sh
     AUTH_SECRET="your_auth_secret"
     ```

   - **GitHub OAuth** (Optional):
     If you need GitHub OAuth, replace the following variables with your GitHub OAuth credentials:
     ```sh
     AUTH_GITHUB_ID="your_github_client_id"
     AUTH_GITHUB_SECRET="your_github_client_secret"
     ```

   - **Authentication Callback URL**:
     Set the base URL for authentication callbacks (typically your app's domain):
     ```sh
     AUTH_URL="http://localhost:3000"  # Replace with your production URL if deployed
     ```
   
   - **OpenAI API Configuration** (Optional):
     If you use OpenAI-based features, provide your API key and custom endpoint (if applicable):
     ```sh
     OPENAI_API_KEY="your_openai_api_key"              # Required for AI features
     OPENAI_BASE_URL="your_openai_base_url_if_custom"  # Optional, for self-hosted proxies
     ```

   - **Docker Remote Access Configuration** (Optional):
     If you require remote access to Docker, update the following settings:
     ```sh
     # Docker Remote Access Configuration
     DOCKER_HOST_MODE="remote_or_blank"
     DOCKER_REMOTE_PROTOCOL="http_or_https_or_ssh"
     DOCKER_REMOTE_HOST="your_docker_remote_host"
     DOCKER_REMOTE_PORT="your_docker_remote_port"
     # Docker TLS/SSL Certificate Paths (only required when DOCKER_HOST_MODE is set to "remote" **with TLS** enabled)
     DOCKER_REMOTE_CERTS_PATH="your_certs_path"
     DOCKER_REMOTE_CA_PATH="your_ca_path" # Default: /certs/ca.pem
     DOCKER_REMOTE_CERT_PATH="your_cert_path" # Default: /certs/cert.pem
     DOCKER_REMOTE_KEY_PATH="your_remote_key_path" # Default: /certs/key.pem
     ```

#### Step 4: Start the Application

Once the environment variables are configured, start the application using Docker Compose:

```sh
docker compose -f compose.local.yml up -d --build
```

For Chinese users:

```sh
docker compose -f compose.local.cn.yml up -d --build
```

#### Step 5: Access the Application

The application should now be running. You can access it at:

- **Web Interface**: `http://localhost:3000`
- **LSP Service (C Language)**: `ws://localhost:4594/clangd`
- **LSP Service (C++ Language)**: `ws://localhost:4595/clangd`

#### 📁 `.env.example` File

For reference, you can see the content of the `.env.example` file.

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
