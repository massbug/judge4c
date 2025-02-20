import { create } from "zustand";
import { DEFAULT_LANGUAGE } from "@/config/language";
import { SupportedLanguage } from "@/constants/language";

interface CodeEditorState {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

export const useCodeEditorState = create<CodeEditorState>((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (language) => set({ language }),
}));
