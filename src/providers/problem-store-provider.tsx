"use client";

import {
  EditorLanguage,
  type Submission,
  type EditorLanguageConfig,
  type LanguageServerConfig,
} from "@/generated/client";
import { useStore } from "zustand";
import { type ProblemWithDetails } from "@/types/prisma";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { type ProblemStore, createProblemStore } from "@/stores/problem-store";

export type ProblemStoreApi = ReturnType<typeof createProblemStore>;

export const ProblemStoreContext = createContext<ProblemStoreApi | undefined>(undefined);

export interface ProblemStoreProviderProps {
  children: ReactNode;
  problemId: string;
  problem: ProblemWithDetails;
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
  submissions: Submission[];
}

export const ProblemStoreProvider = ({
  children,
  problemId,
  problem,
  editorLanguageConfigs,
  languageServerConfigs,
  submissions,
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
      editorLanguageConfigs,
      languageServerConfigs,
      submissions,
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
