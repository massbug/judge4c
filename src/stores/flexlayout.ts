import { create } from "zustand";
import { IJsonModel, Model } from "flexlayout-react";
import { createJSONStorage, persist } from "zustand/middleware";

type FlexLayoutState = {
  hasHydrated: boolean;
  model: Model | null;
  jsonModel: IJsonModel;
};

type FlexLayoutAction = {
  setHasHydrated: (hasHydrated: boolean) => void;
  setModel: (model: Model) => void;
  setJsonModel: (jsonModel: IJsonModel) => void;
};

type FlexLayoutStore = FlexLayoutState & FlexLayoutAction;

const createFlexLayoutStore = (storageKey: string, jsonModel: IJsonModel) =>
  create<FlexLayoutStore>()(
    persist(
      (set) => ({
        hasHydrated: false,
        model: null,
        jsonModel: jsonModel,
        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
        setModel: (model) => set({ model }),
        setJsonModel: (jsonModel) => set({ jsonModel }),
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          jsonModel: state.jsonModel,
        }),
        onRehydrateStorage: () => {
          return (state) => {
            state?.setHasHydrated(true);
          };
        },
      }
    )
  );

const initialProblemFlexLayoutJsonModel: IJsonModel = {
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

export const useProblemFlexLayoutStore = createFlexLayoutStore(
  "problem-flexlayout",
  initialProblemFlexLayoutJsonModel
);

const initialProblemEditFlexLayoutJsonModel: IJsonModel = {
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
            id: "detail",
            name: "Details",
            component: "detail",
            enableClose: false,
          },
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

export const useProblemEditFlexLayoutStore = createFlexLayoutStore(
  "problem-edit-flexlayout",
  initialProblemEditFlexLayoutJsonModel
);
