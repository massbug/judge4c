import { create } from "zustand";
import type { DockviewApi } from "dockview";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SubmissionWithTestcaseResult } from "@/types/prisma";

export type DockviewState = {
  api: DockviewApi | null;
  submission: SubmissionWithTestcaseResult | null;
};

export type DockviewActions = {
  setApi: (api: DockviewApi) => void;
  setSubmission: (submission: SubmissionWithTestcaseResult) => void;
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
