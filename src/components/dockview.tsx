"use client";

import type {
  AddPanelOptions,
  DockviewApi,
  DockviewReadyEvent,
} from "dockview";
import "@/styles/dockview.css";
import { DockviewReact, themeAbyssSpaced } from "dockview";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface PanelParams {
  autoAdd?: boolean;
}

interface DockviewProps {
  storageKey?: string;
  onApiReady?: (api: DockviewApi) => void;
  components: Record<string, React.ReactNode>;
  tabComponents: Record<string, React.ReactNode>;
  panelOptions: AddPanelOptions<PanelParams>[];
}

/**
 * Custom hook for handling dockview layout persistence
 */
const useLayoutPersistence = (api: DockviewApi | null, storageKey?: string) => {
  useEffect(() => {
    if (!api || !storageKey) return;

    const handleLayoutChange = () => {
      try {
        const layout = api.toJSON();
        localStorage.setItem(storageKey, JSON.stringify(layout));
      } catch (error) {
        console.error("Failed to save layout:", error);
      }
    };

    const disposable = api.onDidLayoutChange(handleLayoutChange);
    return () => disposable.dispose();
  }, [api, storageKey]);
};

/**
 * Converts React nodes to dockview component functions
 */
const useDockviewComponents = (
  components: Record<string, React.ReactNode>,
  tabComponents: Record<string, React.ReactNode>
) => {
  return useMemo(
    () => ({
      dockviewComponents: Object.fromEntries(
        Object.entries(components).map(([key, value]) => [key, () => value])
      ),
      dockviewTabComponents: Object.fromEntries(
        Object.entries(tabComponents).map(([key, value]) => [key, () => value])
      ),
    }),
    [components, tabComponents]
  );
};

const Dockview = ({
  storageKey,
  onApiReady,
  components,
  tabComponents,
  panelOptions: options,
}: DockviewProps) => {
  const [api, setApi] = useState<DockviewApi | null>(null);
  const { dockviewComponents, dockviewTabComponents } = useDockviewComponents(
    components,
    tabComponents
  );

  useLayoutPersistence(api, storageKey);

  const loadLayoutFromStorage = useCallback(
    (api: DockviewApi, key: string): boolean => {
      if (!key) return false;

      try {
        const serializedLayout = localStorage.getItem(key);
        if (!serializedLayout) return false;

        api.fromJSON(JSON.parse(serializedLayout));
        return true;
      } catch (error) {
        console.error("Failed to load layout:", error);
        localStorage.removeItem(key);
        return false;
      }
    },
    []
  );

  const addDefaultPanels = useCallback(
    (api: DockviewApi, options: AddPanelOptions<PanelParams>[]) => {
      const existingIds = new Set<string>();
      options.forEach((option) => {
        if (existingIds.has(option.id)) {
          console.warn(`Duplicate panel ID detected: ${option.id}`);
          return;
        }
        existingIds.add(option.id);
        if (option.params?.autoAdd ?? true) {
          api.addPanel(option);
        }
      });
    },
    []
  );

  const handleReady = useCallback(
    (event: DockviewReadyEvent) => {
      setApi(event.api);

      const layoutLoaded = storageKey
        ? loadLayoutFromStorage(event.api, storageKey)
        : false;

      if (!layoutLoaded) {
        addDefaultPanels(event.api, options);
      }

      onApiReady?.(event.api);
    },
    [storageKey, loadLayoutFromStorage, addDefaultPanels, onApiReady, options]
  );

  return (
    <DockviewReact
      theme={themeAbyssSpaced}
      onReady={handleReady}
      components={dockviewComponents}
      tabComponents={dockviewTabComponents}
    />
  );
};

export { Dockview };
