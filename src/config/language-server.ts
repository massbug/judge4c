import { EditorLanguage } from "@/types/editor-language";
import { EditorLanguageConfig } from "./editor-language";
import { LanguageServerMetadata } from "@/types/language-server";

const LanguageServerConfig: Record<EditorLanguage, LanguageServerMetadata> = {
  [EditorLanguage.C]: {
    protocol: process.env.NEXT_PUBLIC_LSP_C_PROTOCOL || "ws",
    hostname: process.env.NEXT_PUBLIC_LSP_C_HOSTNAME || "localhost",
    port: process.env.NEXT_PUBLIC_LSP_C_PORT ? parseInt(process.env.NEXT_PUBLIC_LSP_C_PORT, 10) : 4594,
    path: process.env.NEXT_PUBLIC_LSP_C_PATH || "/clangd",
    lang: EditorLanguageConfig[EditorLanguage.C],
  },
  [EditorLanguage.CPP]: {
    protocol: process.env.NEXT_PUBLIC_LSP_CPP_PROTOCOL || "ws",
    hostname: process.env.NEXT_PUBLIC_LSP_CPP_HOSTNAME || "localhost",
    port: process.env.NEXT_PUBLIC_LSP_CPP_PORT ? parseInt(process.env.NEXT_PUBLIC_LSP_CPP_PORT, 10) : 4595,
    path: process.env.NEXT_PUBLIC_LSP_CPP_PATH || "/clangd",
    lang: EditorLanguageConfig[EditorLanguage.CPP],
  },
};

export default LanguageServerConfig;
