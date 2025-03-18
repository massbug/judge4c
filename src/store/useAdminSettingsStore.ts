import { create } from "zustand";
import { EditorLanguage } from "@prisma/client";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_EDITOR_LANGUAGE } from "@/config/editor-language";

interface AdminSettingsState {
  hydrated: boolean;
  activeLanguageServerSetting: EditorLanguage;
  setHydrated: (value: boolean) => void;
  setActiveLanguageServerSetting: (language: EditorLanguage) => void;
}

export const useAdminSettingsStore = create<AdminSettingsState>()(
  persist(
    (set) => ({
      hydrated: false,
      activeLanguageServerSetting: DEFAULT_EDITOR_LANGUAGE,
      setHydrated: (value) => set({ hydrated: value }),
      setActiveLanguageServerSetting: (language) =>
        set({ activeLanguageServerSetting: language }),
    }),
    {
      name: "settings-admin",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeLanguageServerSetting: state.activeLanguageServerSetting,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("An error happened during hydration", error);
          } else if (state) {
            state.setHydrated(true);
          }
        };
      },
    }
  )
);
