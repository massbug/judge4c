import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProblemSchema } from "@/components/features/dashboard/admin/problemset/new/schema";

interface NewProblemActions {
  setHydrated: (value: boolean) => void;
  setData: (data: Partial<ProblemSchema>) => void;
}

type NewProblemState = Partial<ProblemSchema> & {
  hydrated: boolean;
} & NewProblemActions;

export const useNewProblemStore = create<NewProblemState>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setData: (data) => set(data),
    }),
    {
      name: "zustand:new-problem",
      storage: createJSONStorage(() => localStorage),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      partialize: ({ hydrated, ...rest }) => rest,
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
