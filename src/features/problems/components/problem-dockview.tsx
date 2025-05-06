"use client";

import { useLocale } from "next-intl";
import type { AddPanelOptions } from "dockview";
import { Dockview, type PanelParams } from "@/components/dockview";
import { useProblemDockviewStore } from "@/stores/problem-dockview";

interface ProblemDockviewProps {
  components: Record<string, React.ReactNode>;
  tabComponents: Record<string, React.ReactNode>;
  panelOptions: AddPanelOptions<PanelParams>[];
}

const ProblemDockview = ({
  components,
  tabComponents,
  panelOptions,
}: ProblemDockviewProps) => {
  const locale = useLocale();
  const { setApi } = useProblemDockviewStore();

  return (
    <Dockview
      key={locale}
      storageKey="dockview:problem"
      onApiReady={setApi}
      components={components}
      tabComponents={tabComponents}
      panelOptions={panelOptions}
    />
  );
};

export { ProblemDockview };
