import { EditorLanguage } from "@/types/editor-language";
import { EditorLanguageConfig } from "./editor-language";
import { LanguageServerMetadata } from "@/types/language-server";

const LanguageServerConfig: Record<EditorLanguage, LanguageServerMetadata> = {
  [EditorLanguage.C]: {
    protocol: "ws",
    hostname: "localhost",
    port: 4594,
    path: "/clangd",
    lang: EditorLanguageConfig[EditorLanguage.C],
  },
  [EditorLanguage.CPP]: {
    protocol: "ws",
    hostname: "localhost",
    port: 4595,
    path: "/clangd",
    lang: EditorLanguageConfig[EditorLanguage.CPP],
  },
};

export default LanguageServerConfig;
