import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  activeSetting: string;
  isDialogOpen: boolean;
  setActiveSetting: (setting: string) => void;
  setDialogOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      activeSetting: "Appearance",
      isDialogOpen: false,
      setActiveSetting: (setting) => set({ activeSetting: setting }),
      setDialogOpen: (open) => set({ isDialogOpen: open }),
    }),
    {
      name: "settings-state",
      partialize: (state) => ({
        activeNav: state.activeSetting,
        isDialogOpen: state.isDialogOpen,
      }),
    }
  )
);
