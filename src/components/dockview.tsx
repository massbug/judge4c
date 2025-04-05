"use client";

import {
  BotIcon,
  CircleCheckBigIcon,
  FileTextIcon,
  FlaskConicalIcon,
  SquareCheckIcon,
  SquarePenIcon,
  TerminalIcon,
} from "lucide-react";
import "@/styles/dockview.css";
import { useEffect, useMemo, useState } from "react";
import { DockviewReact, themeAbyssSpaced } from "dockview";
import type { AddPanelOptions, DockviewReadyEvent, DockviewApi } from "dockview";

const iconMap = {
  FileTextIcon,
  FlaskConicalIcon,
  CircleCheckBigIcon,
  SquarePenIcon,
  SquareCheckIcon,
  TerminalIcon,
  BotIcon,
} as const;

type IconKey = keyof typeof iconMap;

interface DockviewProps {
  options: (AddPanelOptions & {
    node: React.ReactNode;
    icon: IconKey;
  })[];
  storageKey: string;
}

const DockView = ({ options, storageKey }: DockviewProps) => {
  const [api, setApi] = useState<DockviewApi>();

  const { components, tabComponents } = useMemo(() => {
    const comps: Record<string, () => React.ReactNode> = {};
    const tabs: Record<string, () => React.ReactNode> = {};

    options.forEach((option) => {
      const { id, icon, node, title } = option;

      comps[id] = () => <>{node}</>;

      const Icon = iconMap[icon];
      tabs[id] = () => (
        <div className="flex items-center px-1 text-sm font-medium">
          <Icon
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
            aria-hidden="true"
          />
          <span>{title}</span>
        </div>
      );
    });

    return { components: comps, tabComponents: tabs };
  }, [options]);

  useEffect(() => {
    if (!api) return;

    const disposable = api.onDidLayoutChange(() => {
      localStorage.setItem(storageKey, JSON.stringify(api.toJSON()));
    });

    return () => disposable.dispose();
  }, [api, storageKey]);

  const handleReady = (event: DockviewReadyEvent) => {
    setApi(event.api);
    const serializedLayout = localStorage.getItem(storageKey);

    const addDefaultPanels = () => {
      options.forEach((option) => {
        event.api.addPanel({ ...option });
      });
    };

    if (serializedLayout) {
      try {
        event.api.fromJSON(JSON.parse(serializedLayout));
      } catch (error) {
        console.error("Failed to parse layout:", error);
        localStorage.removeItem(storageKey);
        addDefaultPanels();
      }
    } else {
      addDefaultPanels();
    }
  };

  return (
    <DockviewReact
      theme={themeAbyssSpaced}
      onReady={handleReady}
      components={components}
      tabComponents={tabComponents}
    />
  );
};

export default DockView;
