import { create } from "zustand";
import { EditorLanguage } from "@prisma/client";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor-language";

/**
 * State management for problem editor settings.
 */
interface ProblemEditorState {
  globalEditorLanguage: EditorLanguage;
  setGlobalEditorLanguage: (language: EditorLanguage) => void;
}

export const useProblemEditorStore = create<ProblemEditorState>()(
  persist(
    (set) => ({
      globalEditorLanguage: DEFAULT_EDITOR_LANGUAGE,
      setGlobalEditorLanguage: (language) => set({ globalEditorLanguage: language }),
    }),
    {
      name: "problem-editor",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ globalEditorLanguage: state.globalEditorLanguage }),
    }
  )
);
