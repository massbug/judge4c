import { create } from "zustand";
import { IJsonModel, Model } from "flexlayout-react";
import { createJSONStorage, persist } from "zustand/middleware";

const initialJsonModel: IJsonModel = {
  global: {
    // tabEnableClose: false,
    tabEnableRename: false,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        id: "1",
        weight: 50,
        children: [
          {
            type: "tab",
            id: "description",
            name: "Description",
            component: "description",
            enableClose: false,
          },
          {
            type: "tab",
            id: "solution",
            name: "Solutions",
            component: "solution",
            enableClose: false,
          },
          {
            type: "tab",
            id: "submission",
            name: "Submissions",
            component: "submission",
            enableClose: false,
          },
          // {
          //   type: "tab",
          //   id: "detail",
          //   name: "Details",
          //   component: "detail",
          // },
        ],
      },
      {
        type: "row",
        weight: 50,
        children: [
          {
            type: "tabset",
            id: "2",
            weight: 50,
            children: [
              {
                type: "tab",
                id: "code",
                name: "Code",
                component: "code",
                enableClose: false,
              },
            ],
          },
          {
            type: "tabset",
            id: "3",
            weight: 50,
            children: [
              {
                type: "tab",
                id: "testcase",
                name: "Testcase",
                component: "testcase",
                enableClose: false,
              },
            ],
          },
        ],
      },
    ],
  },
};

type ProblemFlexLayoutState = {
  model: Model | null;
  jsonModel: IJsonModel;
};

type ProblemFlexLayoutAction = {
  setModel: (model: Model) => void;
  setJsonModel: (jsonModel: IJsonModel) => void;
};

type ProblemFlexLayoutStore = ProblemFlexLayoutState & ProblemFlexLayoutAction;

export const useProblemFlexLayoutStore = create<ProblemFlexLayoutStore>()(
  persist(
    (set) => ({
      model: null,
      jsonModel: initialJsonModel,
      setModel: (model) => set({ model }),
      setJsonModel: (jsonModel) => set({ jsonModel }),
    }),
    {
      name: "problem-flexlayout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        jsonModel: state.jsonModel,
      }),
    }
  )
);
