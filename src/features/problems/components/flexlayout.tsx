"use client";

import {
  BotIcon,
  CircleCheckBigIcon,
  FileTextIcon,
  FlaskConicalIcon,
  SquareCheckIcon,
  SquarePenIcon,
} from "lucide-react";
import {
  IJsonModel,
  ITabRenderValues,
  Layout,
  Model,
  TabNode,
} from "flexlayout-react";
import "@/styles/flexlayout.css";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FlexLayoutProps {
  components: Record<string, React.ReactNode>;
  hasHydrated: boolean;
  model: Model | null;
  jsonModel: IJsonModel;
  setModel: (model: Model) => void;
  setJsonModel: (jsonModel: IJsonModel) => void;
}

export const FlexLayout = ({
  components,
  hasHydrated,
  model,
  jsonModel,
  setModel,
  setJsonModel,
}: FlexLayoutProps) => {
  const t = useTranslations("ProblemPage");

  useEffect(() => {
    if (hasHydrated && !model) {
      const model = Model.fromJson(jsonModel);
      setModel(model);
    }
  }, [hasHydrated, jsonModel, model, setModel]);

  const onModelChange = useCallback(
    (model: Model) => {
      const jsonModel = model.toJson();
      setJsonModel(jsonModel);
    },
    [setJsonModel]
  );

  const factory = useCallback(
    (node: TabNode) => {
      const component = node.getComponent();
      return component ? components[component] : null;
    },
    [components]
  );

  const onRenderTab = useCallback(
    (node: TabNode, renderValues: ITabRenderValues) => {
      const Icon = getIconForTab(node.getId());
      renderValues.leading = Icon ? (
        <Icon className="opacity-60" size={16} aria-hidden="true" />
      ) : null;
      renderValues.content = (
        <span className="text-sm font-medium">
          {t(node.getName()) || node.getName()}
        </span>
      );
    },
    [t]
  );

  if (!model || !hasHydrated)
    return <Skeleton className="h-full w-full rounded-2xl" />;

  return (
    <Layout
      model={model}
      factory={factory}
      onRenderTab={onRenderTab}
      onModelChange={onModelChange}
      realtimeResize={true}
    />
  );
};

const getIconForTab = (id: string) => {
  switch (id) {
    case "description":
      return FileTextIcon;
    case "solution":
      return FlaskConicalIcon;
    case "submission":
      return CircleCheckBigIcon;
    case "detail":
      return CircleCheckBigIcon;
    case "code":
      return SquarePenIcon;
    case "testcase":
      return SquareCheckIcon;
    case "bot":
      return BotIcon;
  }
};
