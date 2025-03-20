"use client";

import type {
  EditorLanguage,
  EditorLanguageConfig,
  LanguageServerConfig,
  Template,
} from "@prisma/client";
import type { editor } from "monaco-editor";
import { createStore, StoreApi, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MonacoLanguageClient } from "monaco-languageclient";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor-language";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type ProblemEditorState = {
  hydrated: boolean;
  editor: editor.IStandaloneCodeEditor | null;
  monacoLanguageClient: MonacoLanguageClient | null;
  globalLang: EditorLanguage;
  currentLang: EditorLanguage;
  currentValue: string;
  problemId: string;
  templates: Template[];
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
};

type ProblemEditorActions = {
  setHydrated: (value: boolean) => void;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setMonacoLanguageClient: (client: MonacoLanguageClient | null) => void;
  setGlobalLang: (lang: EditorLanguage) => void;
  setCurrentLang: (lang: EditorLanguage) => void;
  setCurrentValue: (value: string) => void;
};

type ProblemEditorStore = ProblemEditorState & ProblemEditorActions;

const ProblemEditorContext = createContext<StoreApi<ProblemEditorStore> | undefined>(undefined);

type ProblemEditorProviderProps = PropsWithChildren & {
  problemId: string;
  templates: Template[];
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
};

export function ProblemEditorProvider({
  children,
  problemId,
  templates,
  editorLanguageConfigs,
  languageServerConfigs,
}: ProblemEditorProviderProps) {
  const [store] = useState(() =>
    createStore<ProblemEditorStore>()(
      persist(
        (set) => ({
          hydrated: false,
          editor: null,
          monacoLanguageClient: null,
          globalLang: DEFAULT_EDITOR_LANGUAGE,
          currentLang: DEFAULT_EDITOR_LANGUAGE,
          currentValue: "",
          problemId,
          templates,
          editorLanguageConfigs,
          languageServerConfigs,
          setHydrated: (value) => set({ hydrated: value }),
          setEditor: (editor) => set({ editor }),
          setMonacoLanguageClient: (client) => set({ monacoLanguageClient: client }),
          setGlobalLang: (lang) => set({ globalLang: lang }),
          setCurrentLang: (lang) => set({ currentLang: lang }),
          setCurrentValue: (value) => set({ currentValue: value }),
        }),
        {
          name: "problem-store",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            globalLang: state.globalLang,
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
    )
  );

  return (
    <ProblemEditorContext.Provider value={store}>
      {children}
    </ProblemEditorContext.Provider>
  );
}

export function useProblemEditorStore<T>(selector: (state: ProblemEditorStore) => T) {
  const context = useContext(ProblemEditorContext);
  if (!context) {
    throw new Error("ProblemEditorContext.Provider is missing.");
  }
  return useStore(context, selector);
}
