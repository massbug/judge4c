import { create } from "zustand";
import type { DockviewApi } from "dockview";

export type DockviewState = {
  api: DockviewApi | null;
};

export type DockviewActions = {
  setApi: (api: DockviewApi) => void;
};

export type DockviewStore = DockviewState & DockviewActions;

export const useDockviewStore = create<DockviewStore>()((set) => ({
  api: null,
  setApi: (api) => set({ api }),
}));
