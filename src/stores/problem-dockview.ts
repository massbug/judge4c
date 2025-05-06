import { create } from "zustand";
import type { DockviewApi } from "dockview";

export type ProblemDockviewState = {
  api: DockviewApi | null;
};

export type ProblemDockviewActions = {
  setApi: (api: DockviewApi) => void;
};

export type ProblemDockviewStore = ProblemDockviewState &
  ProblemDockviewActions;

export const useProblemDockviewStore = create<ProblemDockviewStore>()(
  (set) => ({
    api: null,
    setApi: (api) => set({ api }),
  })
);
