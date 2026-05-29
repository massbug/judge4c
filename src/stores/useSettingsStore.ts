import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  stickyScroll: boolean;
}

interface SettingsState {
  activeSetting: string;
  isDialogOpen: boolean;
  editorSettings: EditorSettings;
  setActiveSetting: (setting: string) => void;
  setDialogOpen: (open: boolean) => void;
  setEditorSetting: <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      activeSetting: "Appearance",
      isDialogOpen: false,
      editorSettings: {
        fontSize: 14,
        wordWrap: true,
        minimap: false,
        stickyScroll: true,
      },
      setActiveSetting: (setting) => set({ activeSetting: setting }),
      setDialogOpen: (open) => set({ isDialogOpen: open }),
      setEditorSetting: (key, value) =>
        set((state) => ({
          editorSettings: {
            ...state.editorSettings,
            [key]: value,
          },
        })),
    }),
    {
      name: "settings-state",
      partialize: (state) => ({
        activeSetting: state.activeSetting,
        isDialogOpen: state.isDialogOpen,
        editorSettings: state.editorSettings,
      }),
    }
  )
);
