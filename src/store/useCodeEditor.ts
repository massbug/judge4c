import { create } from "zustand";
import * as monaco from "monaco-editor";
import { CODE_EDITOR_OPTIONS } from "@/constants/option";
import { SupportedLanguage } from "@/constants/language";
import { MonacoLanguageClient } from "monaco-languageclient";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor/language";

interface CodeEditorState {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  language: SupportedLanguage;
  languageClient: MonacoLanguageClient | null;
  loading: boolean;
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setLanguageClient: (languageClient: MonacoLanguageClient | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useCodeEditorState = create<CodeEditorState>((set) => ({
  editor: null,
  language: DEFAULT_EDITOR_LANGUAGE,
  languageClient: null,
  loading: true,
  setEditor: (editor) => set({ editor }),
  setLanguage: (language) => set({ language }),
  setLanguageClient: (languageClient) => set({ languageClient }),
  setLoading: (loading) => set({ loading }),
}));

export const useCodeEditorOption = create<monaco.editor.IEditorConstructionOptions>((set) => ({
  fontSize: CODE_EDITOR_OPTIONS.fontSize,
  lineHeight: CODE_EDITOR_OPTIONS.lineHeight,
  setFontSize: (fontSize: number) => set({ fontSize }),
  setLineHeight: (lineHeight: number) => set({ lineHeight }),
}));

async function initializeEditor() {
  useCodeEditorState.getState().setLoading(false);
}

initializeEditor();
