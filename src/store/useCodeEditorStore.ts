import { create } from "zustand";
import type { editor } from "monaco-editor";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor-language";
import { DefaultEditorOptionConfig } from "@/config/editor-option";
import { EditorLanguage, JudgeResult, LanguageServerConfig } from "@prisma/client";

interface CodeEditorState {
  hydrated: boolean;
  language: EditorLanguage;
  path: string;
  value: string;
  lspConfig: LanguageServerConfig | null;
  isLspEnabled: boolean;
  editorConfig: editor.IEditorConstructionOptions;
  editor: editor.IStandaloneCodeEditor | null;
  result: JudgeResult | null;
  setHydrated: (value: boolean) => void;
  setLanguage: (language: EditorLanguage) => void;
  setPath: (path: string) => void;
  setValue: (value: string) => void;
  setLspConfig: (lspConfig: LanguageServerConfig | null) => void;
  setIsLspEnabled: (enabled: boolean) => void;
  setEditorConfig: (editorConfig: editor.IEditorConstructionOptions) => void;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setResult: (result: JudgeResult) => void;
}

export const useCodeEditorStore = create<CodeEditorState>()(
  persist(
    (set) => ({
      hydrated: false,
      language: DEFAULT_EDITOR_LANGUAGE,
      path: "",
      value: "",
      lspConfig: null,
      isLspEnabled: true,
      editorConfig: DefaultEditorOptionConfig,
      editor: null,
      result: null,
      setHydrated: (value) => set({ hydrated: value }),
      setLanguage: (language) => set({ language }),
      setPath: (path) => set({ path }),
      setValue: (value) => set({ value }),
      setLspConfig: (lspConfig) => set({ lspConfig }),
      setIsLspEnabled: (enabled) => set({ isLspEnabled: enabled }),
      setEditorConfig: (editorConfig) => set({ editorConfig }),
      setEditor: (editor) => set({ editor }),
      setResult: (result) => set({ result }),
    }),
    {
      name: "code-editor-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        path: state.path,
        value: state.value,
        isLspEnabled: state.isLspEnabled,
        editorConfig: state.editorConfig,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("An error happened during hydration", error);
          } else if (state) {
            state.setHydrated(true);
          }
        };
      },
    }
  )
);
