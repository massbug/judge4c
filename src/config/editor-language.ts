import { EditorLanguage } from "@prisma/client";
import { EditorLanguageMetadata } from "@/types/editor-language";

// Define language configurations
const EditorLanguageConfig: Record<EditorLanguage, EditorLanguageMetadata> = {
  [EditorLanguage.c]: {
    id: EditorLanguage.c,
    label: "C",
    fileName: "main",
    fileExtension: ".c",
  },
  [EditorLanguage.cpp]: {
    id: EditorLanguage.cpp,
    label: "C++",
    fileName: "main",
    fileExtension: ".cpp",
  },
};

// Default language configuration
const DefaultEditorLanguageConfig = EditorLanguageConfig[EditorLanguage.c]; // Default to C language

export { EditorLanguageConfig, DefaultEditorLanguageConfig };
