import { EditorLanguage, EditorLanguageMetadata } from "@/types/editor-language";

// Define language configurations
const EditorLanguageConfig: Record<EditorLanguage, EditorLanguageMetadata> = {
  [EditorLanguage.C]: {
    id: EditorLanguage.C,
    label: "C",
    fileName: "main",
    fileExtension: ".c",
  },
  [EditorLanguage.CPP]: {
    id: EditorLanguage.CPP,
    label: "C++",
    fileName: "main",
    fileExtension: ".cpp",
  },
};

// Default language configuration
const DefaultEditorLanguageConfig = EditorLanguageConfig[EditorLanguage.C]; // Default to C language

export { EditorLanguageConfig, DefaultEditorLanguageConfig };
