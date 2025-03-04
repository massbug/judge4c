import { create } from "zustand";
import { type editor } from "monaco-editor";
import { persist } from "zustand/middleware";
import { JudgeResult } from "@/config/judge";
import { SupportedLanguage } from "@/constants/language";
import { MonacoLanguageClient } from "monaco-languageclient";
import { DefaultEditorOptionConfig } from "@/config/editor-option";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor/language";

interface CodeEditorState {
  editor: editor.IStandaloneCodeEditor | null;
  language: SupportedLanguage;
  languageClient: MonacoLanguageClient | null;
  hydrated: boolean;
  result: JudgeResult | null;
  setEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setLanguageClient: (languageClient: MonacoLanguageClient | null) => void;
  setHydrated: (value: boolean) => void;
  setResult: (result: JudgeResult) => void;
}

export const useCodeEditorStore = create<CodeEditorState>()(
  persist(
    (set) => ({
      editor: null,
      language: DEFAULT_EDITOR_LANGUAGE,
      languageClient: null,
      hydrated: false,
      result: null,
      setEditor: (editor) => set({ editor }),
      setLanguage: (language) => set({ language }),
      setLanguageClient: (languageClient) => set({ languageClient }),
      setHydrated: (value) => set({ hydrated: value }),
      setResult: (result) => set({ result }),
    }),
    {
      name: "code-editor-language",
      partialize: (state) => ({
        language: state.language,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("hydrate error", error);
        } else if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

export const useCodeEditorOptionStore = create<editor.IEditorConstructionOptions>((set) => ({
  fontSize: DefaultEditorOptionConfig.fontSize,
  lineHeight: DefaultEditorOptionConfig.lineHeight,
  setFontSize: (fontSize: number) => set({ fontSize }),
  setLineHeight: (lineHeight: number) => set({ lineHeight }),
}));
