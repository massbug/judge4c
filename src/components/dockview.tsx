"use client";

import type {
  AddPanelOptions,
  DockviewApi,
  DockviewReadyEvent,
  IDockviewPanelHeaderProps,
  IDockviewPanelProps,
} from "dockview";
import "@/styles/dockview.css";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DockviewReact, themeAbyssSpaced } from "dockview";

interface PanelContent {
  icon?: LucideIcon;
  content?: React.ReactNode;
  title?: string;
  autoAdd?: boolean;
}

interface DockviewProps {
  storageKey: string;
  onApiReady?: (api: DockviewApi) => void;
  options: AddPanelOptions<PanelContent>[];
}

export default function DockView({ storageKey, onApiReady, options }: DockviewProps) {
  const [api, setApi] = useState<DockviewApi>();

  const { components, tabComponents } = useMemo(() => {
    const components: Record<
      string,
      React.FunctionComponent<IDockviewPanelProps<PanelContent>>
    > = {};
    const tabComponents: Record<
      string,
      React.FunctionComponent<IDockviewPanelHeaderProps<PanelContent>>
    > = {};

    options.forEach((option) => {
      const { id, params } = option;

      components[id] = () => {
        const content = params?.content;
        return <>{content}</>;
      };

      tabComponents[id] = () => {
        const Icon = params?.icon;
        return (
          <div className="flex items-center px-1 text-sm font-medium">
            {Icon && (
              <Icon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
            )}
            {params?.title}
          </div>
        );
      };
    });

    return { components, tabComponents };
  }, [options]);

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
        const autoAdd = option.params?.autoAdd ?? true;
        if (!autoAdd) return;
        event.api.addPanel({ ...option });
      });
    }
  };

  return (
    <DockviewReact
      theme={themeAbyssSpaced}
      onReady={onReady}
      components={components}
      tabComponents={tabComponents}
    />
  );
}
