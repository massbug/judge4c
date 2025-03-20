"use client";

import type {
  EditorLanguage,
  EditorLanguageConfig,
  LanguageServerConfig,
  Template,
} from "@prisma/client";
import { createStore, StoreApi, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor-language";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type ProblemEditorState = {
  globalLang: EditorLanguage;
  currentLang: EditorLanguage;
  currentValue: string;
  problemId: string;
  templates: Template[];
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
};

type ProblemEditorActions = {
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
          globalLang: DEFAULT_EDITOR_LANGUAGE,
          currentLang: DEFAULT_EDITOR_LANGUAGE,
          currentValue: "",
          problemId,
          templates,
          editorLanguageConfigs,
          languageServerConfigs,
          setGlobalLang: (lang) => set({ globalLang: lang }),
          setCurrentLang: (lang) => set({ currentLang: lang }),
          setCurrentValue: (value) => set({ currentValue: value }),
        }),
        {
          name: "problem-store",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            globalLang: state.globalLang,
            currentLang: state.currentLang,
            currentValue: state.currentValue,
          }),
        }
      )
    )
  );

  return <ProblemEditorContext.Provider value={store}>{children}</ProblemEditorContext.Provider>;
}

export function useProblemEditorStore<T>(selector: (state: ProblemEditorStore) => T) {
  const context = useContext(ProblemEditorContext);
  if (!context) {
    throw new Error("ProblemEditorContext.Provider is missing.");
  }
  return useStore(context, selector);
}

export function useProblemEditorStoreInstance() {
  const context = useContext(ProblemEditorContext);
  if (!context) {
    throw new Error("ProblemEditorContext.Provider is missing.");
  }
  return context;
}
