import { create } from "zustand";
import { DEFAULT_LANGUAGE } from "@/config/language";
import { SupportedLanguage } from "@/constants/language";
import { MonacoLanguageClient } from "monaco-languageclient";

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
