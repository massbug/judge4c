"use client";

import type {
  AddPanelOptions,
  DockviewApi,
  DockviewReadyEvent,
  IDockviewPanelHeaderProps,
  IDockviewPanelProps,
} from "dockview";
import "@/styles/dockview.css";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { DockviewReact, themeAbyssSpaced } from "dockview";

interface DockviewProps {
  storageKey: string;
  options: AddPanelOptions[];
  components: Record<string, React.FunctionComponent<IDockviewPanelProps>>;
  tabComponents?: Record<string, React.FunctionComponent<IDockviewPanelHeaderProps>>;
  onApiReady?: (api: DockviewApi) => void;
}

const DefaultTab = (
  props: IDockviewPanelHeaderProps<{ icon?: string }>
) => {
  const { icon } = props.params;
  const Icon =
    icon && icon in Icons
      ? (Icons[icon as keyof typeof Icons] as LucideIcon)
      : null;

  return (
    <div className="flex items-center px-1 text-sm font-medium">
      {Icon && (
        <Icon
          className="-ms-0.5 me-1.5 opacity-60"
          size={16}
          aria-hidden="true"
        />
      )}
      {props.api.title}
    </div>
  );
};

export default function DockView({
  storageKey,
  options,
  components,
  tabComponents,
  onApiReady,
}: DockviewProps) {
  const [api, setApi] = useState<DockviewApi>();

  useEffect(() => {
    if (!api) return;

    const disposable = api.onDidLayoutChange(() => {
      const layout = api.toJSON();
      localStorage.setItem(storageKey, JSON.stringify(layout));
    });

    return () => disposable.dispose();
  }, [api, storageKey]);

  const onReady = (event: DockviewReadyEvent) => {
    setApi(event.api);
    onApiReady?.(event.api);

    let success = false;
    const serializedLayout = localStorage.getItem(storageKey);

    if (serializedLayout) {
      try {
        const layout = JSON.parse(serializedLayout);
        event.api.fromJSON(layout);
        success = true;
      } catch (error) {
        console.error("Failed to load layout:", error);
        localStorage.removeItem(storageKey);
      }
    }

    if (!success) {
      options.forEach((option) => {
        event.api.addPanel({ ...option });
      });
    }
  };

  return (
    <DockviewReact
      theme={themeAbyssSpaced}
      onReady={onReady}
      components={components}
      defaultTabComponent={DefaultTab}
      tabComponents={tabComponents}
    />
  );
}
