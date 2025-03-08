import { EditorLanguage } from "@prisma/client";
import { COriginal, CplusplusOriginal } from "devicons-react";
import { EditorLanguageMetadata } from "@/types/editor-language";

// Define language configurations
const EditorLanguageConfig: Record<EditorLanguage, EditorLanguageMetadata> = {
  [EditorLanguage.c]: {
    id: EditorLanguage.c,
    label: "C",
    fileName: "main",
    fileExtension: ".c",
    icon: COriginal,
  },
  [EditorLanguage.cpp]: {
    id: EditorLanguage.cpp,
    label: "C++",
    fileName: "main",
    fileExtension: ".cpp",
    icon: CplusplusOriginal,
  },
};

// Default language configuration
const DefaultEditorLanguageConfig = EditorLanguageConfig[EditorLanguage.c]; // Default to C language

export { EditorLanguageConfig, DefaultEditorLanguageConfig };
