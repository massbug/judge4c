"use client";

import { useProblemEditFlexLayoutStore } from "@/stores/flexlayout";
import { FlexLayout } from "@/features/problems/components/flexlayout";

interface ProblemEditFlexLayoutProps {
  components: Record<string, React.ReactNode>;
}

export const ProblemEditFlexLayout = ({
  components,
}: ProblemEditFlexLayoutProps) => {
  const { hasHydrated, model, jsonModel, setModel, setJsonModel } =
    useProblemEditFlexLayoutStore();

  return (
    <FlexLayout
      components={components}
      hasHydrated={hasHydrated}
      model={model}
      jsonModel={jsonModel}
      setModel={setModel}
      setJsonModel={setJsonModel}
    />
  );
};
