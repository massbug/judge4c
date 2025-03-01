import { create } from "zustand";
import { type editor } from "monaco-editor";
import { CODE_EDITOR_OPTIONS } from "@/constants/option";
import { SupportedLanguage } from "@/constants/language";
import { MonacoLanguageClient } from "monaco-languageclient";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor/language";

interface CodeEditorState {
  editor: editor.IStandaloneCodeEditor | null;
  language: SupportedLanguage;
  languageClient: MonacoLanguageClient | null;
  loading: boolean;
  result: string | null;
  setEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setLanguageClient: (languageClient: MonacoLanguageClient | null) => void;
  setLoading: (loading: boolean) => void;
  setResult: (result: string) => void;
}

export const useCodeEditorState = create<CodeEditorState>()(
  persist(
    (set) => ({
      editor: null,
      language: DEFAULT_EDITOR_LANGUAGE,
      languageClient: null,
      loading: true,
      result: null,
      setEditor: (editor) => set({ editor }),
      setLanguage: (language) => set({ language }),
      setLanguageClient: (languageClient) => set({ languageClient }),
      setLoading: (loading) => set({ loading }),
      setResult: (result) => set({ result }),
    }),
    {
      name: "code-editor-language",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language }),
    }
  )
);

export const useCodeEditorOption = create<editor.IEditorConstructionOptions>((set) => ({
  fontSize: CODE_EDITOR_OPTIONS.fontSize,
  lineHeight: CODE_EDITOR_OPTIONS.lineHeight,
  setFontSize: (fontSize: number) => set({ fontSize }),
  setLineHeight: (lineHeight: number) => set({ lineHeight }),
}));

async function initializeEditor() {
  useCodeEditorState.getState().setLoading(false);
}

initializeEditor();
