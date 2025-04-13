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
import Dockview from "@/components/dockview";
import { useDockviewStore } from "@/stores/dockview";

interface ProblemPageProps {
  Description: React.ReactNode;
  Solutions: React.ReactNode;
  Submissions: React.ReactNode;
  Code: React.ReactNode;
  Testcase: React.ReactNode;
  TestResult: React.ReactNode;
  Bot: React.ReactNode;
}

export default function ProblemPage({
  Description,
  Solutions,
  Submissions,
  Code,
  Testcase,
  TestResult,
  Bot,
}: ProblemPageProps) {
  const { setApi } = useDockviewStore();
  return (
    <Dockview
      storageKey="dockview:problem"
      onApiReady={setApi}
      options={[
        {
          id: "Description",
          component: "Description",
          tabComponent: "Description",
          title: "Description",
          params: {
            icon: FileTextIcon,
            content: Description,
          },
        },
        {
          id: "Solutions",
          component: "Solutions",
          tabComponent: "Solutions",
          title: "Solutions",
          params: {
            icon: FlaskConicalIcon,
            content: Solutions,
          },
          position: {
            referencePanel: "Description",
            direction: "within",
          },
          inactive: true,
        },
        {
          id: "Submissions",
          component: "Submissions",
          tabComponent: "Submissions",
          title: "Submissions",
          params: {
            icon: CircleCheckBigIcon,
            content: Submissions,
          },
          position: {
            referencePanel: "Solutions",
            direction: "within",
          },
          inactive: true,
        },
        {
          id: "Code",
          component: "Code",
          tabComponent: "Code",
          title: "Code",
          params: {
            icon: SquarePenIcon,
            content: Code,
          },
          position: {
            referencePanel: "Submissions",
            direction: "right",
          },
        },
        {
          id: "Testcase",
          component: "Testcase",
          tabComponent: "Testcase",
          title: "Testcase",
          params: {
            icon: SquareCheckIcon,
            content: Testcase,
          },
          position: {
            referencePanel: "Code",
            direction: "below",
          },
        },
        {
          id: "TestResult",
          component: "TestResult",
          tabComponent: "TestResult",
          title: "Test Result",
          params: {
            icon: TerminalIcon,
            content: TestResult,
          },
          position: {
            referencePanel: "Testcase",
            direction: "within",
          },
          inactive: true,
        },
        {
          id: "Bot",
          component: "Bot",
          tabComponent: "Bot",
          title: "Bot",
          params: {
            icon: BotIcon,
            content: Bot,
            autoAdd: false,
          },
          position: {
            direction: "right",
          },
        },
      ]}
    />
  );
}
