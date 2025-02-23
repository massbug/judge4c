import { create } from "zustand";
import * as monaco from "monaco-editor";
import { DEFAULT_LANGUAGE } from "@/config/language";
import { SupportedLanguage } from "@/constants/language";
import { MonacoLanguageClient } from "monaco-languageclient";
import { CODE_EDITOR_OPTIONS } from "@/constants/code-editor-options";

interface CodeEditorState {
  language: SupportedLanguage;
  languageClient: MonacoLanguageClient | null;
  setLanguage: (language: SupportedLanguage) => void;
  setLanguageClient: (languageClient: MonacoLanguageClient | null) => void;
}

export const useCodeEditorState = create<CodeEditorState>((set) => ({
  language: DEFAULT_LANGUAGE,
  languageClient: null,
  setLanguage: (language) => set({ language }),
  setLanguageClient: (languageClient) => set({ languageClient }),
}));

export const useCodeEditorOption = create<monaco.editor.IEditorConstructionOptions>((set) => ({
  fontSize: CODE_EDITOR_OPTIONS.fontSize,
  lineHeight: CODE_EDITOR_OPTIONS.lineHeight,
  setFontSize: (fontSize: number) => set({ fontSize }),
  setLineHeight: (lineHeight: number) => set({ lineHeight })
}))
