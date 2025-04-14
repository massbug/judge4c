import { create } from "zustand";
import type { DockviewApi } from "dockview";
import type { Submission } from "@/generated/client";
import { createJSONStorage, persist } from "zustand/middleware";

export type DockviewState = {
  api: DockviewApi | null;
  submission: Submission | null;
};

export type DockviewActions = {
  setApi: (api: DockviewApi) => void;
  setSubmission: (submission: Submission) => void;
};

export type DockviewStore = DockviewState & DockviewActions;

export const useDockviewStore = create<DockviewStore>()(
  persist(
    (set) => ({
      api: null,
      submission: null,
      setApi: (api) => set({ api }),
      setSubmission: (submission) => set({ submission }),
    }),
    {
      name: "zustand:dockview",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        submission: state.submission,
      }),
    }
  )
);
