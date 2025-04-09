"use client";

import {
  EditorLanguage,
  type Problem,
  type EditorLanguageConfig,
  type LanguageServerConfig,
  type Template,
} from "@/generated/client";
import { useStore } from "zustand";
import { TestcaseWithData } from "@/types/prisma";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { type ProblemStore, createProblemStore } from "@/stores/problem-store";

export type ProblemStoreApi = ReturnType<typeof createProblemStore>;

export const ProblemStoreContext = createContext<ProblemStoreApi | undefined>(
  undefined
);

export interface ProblemStoreProviderProps {
  children: ReactNode;
  problemId: string;
  problem: Problem;
  templates: Template[];
  testcases: TestcaseWithData;
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
}

export const ProblemStoreProvider = ({
  children,
  problemId,
  problem,
  templates,
  testcases,
  editorLanguageConfigs,
  languageServerConfigs,
}: ProblemStoreProviderProps) => {
  const storeRef = useRef<ProblemStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createProblemStore({
      hydrated: false,
      editor: null,
      markers: [],
      webSocket: null,
      globalLang: EditorLanguage.c,
      currentLang: EditorLanguage.c,
      currentValue: "",
      problemId,
      problem,
      templates,
      testcases,
      editorLanguageConfigs,
      languageServerConfigs,
    });
  }

  return (
    <ProblemStoreContext.Provider value={storeRef.current}>
      {children}
    </ProblemStoreContext.Provider>
  );
};

export const useProblemStore = <T,>(selector: (store: ProblemStore) => T): T => {
  const problemStoreContext = useContext(ProblemStoreContext);

  if (!problemStoreContext) {
    throw new Error("useProblemStore must be used within ProblemStoreProvider");
  }

  return useStore(problemStoreContext, selector);
};
