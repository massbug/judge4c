import type {
  EditorLanguage,
  EditorLanguageConfig,
  LanguageServerConfig,
  Submission,
} from "@/generated/client";
import type { editor } from "monaco-editor";
import { createStore } from "zustand/vanilla";
import type { ProblemWithDetails } from "@/types/prisma";
import { createJSONStorage, persist } from "zustand/middleware";

export type ProblemState = {
  hydrated: boolean;
  editor: editor.IStandaloneCodeEditor | null;
  markers: editor.IMarker[];
  webSocket: WebSocket | null;
  globalLang: EditorLanguage;
  currentLang: EditorLanguage;
  currentValue: string;
  problemId: string;
  problem: ProblemWithDetails;
  editorLanguageConfigs: EditorLanguageConfig[];
  languageServerConfigs: LanguageServerConfig[];
  submissions: Submission[];
};

export type ProblemActions = {
  setHydrated: (value: boolean) => void;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setMarkers: (markers: editor.IMarker[]) => void;
  setWebSocket: (webSocket: WebSocket | null) => void;
  setGlobalLang: (lang: EditorLanguage) => void;
  setCurrentLang: (lang: EditorLanguage) => void;
  setCurrentValue: (value: string) => void;
};

export type ProblemStore = ProblemState & ProblemActions;

export const createProblemStore = (initState: ProblemState) => {
  return createStore<ProblemStore>()(
    persist(
      (set) => ({
        ...initState,
        setHydrated: (value) => set({ hydrated: value }),
        setEditor: (editor) => set({ editor }),
        setMarkers: (markers) => set({ markers }),
        setWebSocket: (webSocket) => set({ webSocket }),
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
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.error("An error happened during hydration", error);
          } else if (state) {
            state.setHydrated(true);
          }
        },
      }
    )
  );
};
