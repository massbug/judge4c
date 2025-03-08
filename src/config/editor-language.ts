import { EditorLanguage } from "@prisma/client";
import { COriginal, CplusplusOriginal } from "devicons-react";
import { EditorLanguageMetadata } from "@/types/editor-language";

// Define language configurations
const EditorLanguageConfig: Record<EditorLanguage, EditorLanguageMetadata> = {
  [EditorLanguage.C]: {
    id: EditorLanguage.C,
    label: "C",
    fileName: "main",
    fileExtension: ".c",
    icon: COriginal,
  },
  [EditorLanguage.CPP]: {
    id: EditorLanguage.CPP,
    label: "C++",
    fileName: "main",
    fileExtension: ".cpp",
    icon: CplusplusOriginal,
  },
};

// Default language configuration
const DefaultEditorLanguageConfig = EditorLanguageConfig[EditorLanguage.C]; // Default to C language

export { EditorLanguageConfig, DefaultEditorLanguageConfig };
