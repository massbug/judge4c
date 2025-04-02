import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProblemSchema } from "@/components/features/dashboard/admin/problemset/new/schema";

type NewProblemState = Partial<ProblemSchema> & {
  setData: (data: Partial<ProblemSchema>) => void;
};

export const useNewProblemStore = create<NewProblemState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: "new-problem-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
