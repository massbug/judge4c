"use client";

import {
  DockviewReact,
  themeAbyssSpaced,
  type DockviewReadyEvent,
  type IDockviewPanelHeaderProps,
} from "dockview";
import { 
  CircleCheckBigIcon, 
  FileTextIcon, 
  FlaskConicalIcon, 
  type LucideProps, 
  SquareCheckIcon, 
  SquarePenIcon, 
  TerminalIcon 
} from "lucide-react";
import "@/styles/dockview.css";
import { type ForwardRefExoticComponent, type RefAttributes, useMemo } from "react";

interface DockviewProps {
  Description: React.ReactNode;
  Solutions: React.ReactNode;
  Submissions: React.ReactNode;
  Code: React.ReactNode;
  Testcase: React.ReactNode;
  TestResult: React.ReactNode;
}

const PanelIcons: Record<string, ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>> = {
  Description: FileTextIcon,
  Solutions: FlaskConicalIcon,
  Submissions: CircleCheckBigIcon,
  Code: SquarePenIcon,
  Testcase: SquareCheckIcon,
  TestResult: TerminalIcon,
};

const LAYOUT_STORAGE_KEY = "dockview:layout";

const DefaultTab = ({ params }: IDockviewPanelHeaderProps<{ title: string }>) => {
  const { title } = params;
  const Icon = PanelIcons[title];

  return (
    <div className="flex items-center px-1 text-sm font-medium">
      {Icon && (
        <Icon
          className="-ms-0.5 me-1.5 opacity-60"
          size={16}
          aria-hidden="true"
        />
      )}
      <span>{title}</span>
    </div>
  );
};

const tabComponents = {
  default: DefaultTab,
};

const DEFAULT_PANELS = [
  { id: "Description", component: "Description", position: null },
  {
    id: "Solutions",
    component: "Solutions",
    position: { referencePanel: "Description", direction: "within" },
  },
  {
    id: "Submissions",
    component: "Submissions",
    position: { referencePanel: "Solutions", direction: "within" },
  },
  {
    id: "Code",
    component: "Code",
    position: { referencePanel: "Submissions", direction: "right" },
  },
  {
    id: "Testcase",
    component: "Testcase",
    position: { referencePanel: "Code", direction: "below" },
  },
  {
    id: "TestResult",
    component: "TestResult",
    position: { referencePanel: "Testcase", direction: "within" },
  },
];

export default function DockView(props: DockviewProps) {
  const components = useMemo(
    () => ({
      Description: () => props.Description,
      Solutions: () => props.Solutions,
      Submissions: () => props.Submissions,
      Code: () => props.Code,
      Testcase: () => props.Testcase,
      TestResult: () => props.TestResult,
    }),
    [props]
  );

  const handleReady = (event: DockviewReadyEvent) => {
    let success = false;

    try {
      const layout = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (layout) {
        event.api.fromJSON(JSON.parse(layout));
        success = true;
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    }

    if (!success) {
      DEFAULT_PANELS.forEach(({ id, component, position }) => {
        event.api.addPanel({
          id,
          component,
          tabComponent: "default",
          params: { title: id },
          position: position || undefined,
        });
      });
    }

    const saveLayout = () => {
      localStorage.setItem(
        LAYOUT_STORAGE_KEY,
        JSON.stringify(event.api.toJSON())
      );
    };

    const disposable = event.api.onDidLayoutChange(saveLayout);
    return () => disposable.dispose();
  };

  return (
    <DockviewReact
      theme={themeAbyssSpaced}
      onReady={handleReady}
      components={components}
      tabComponents={tabComponents}
    />
  );
}
