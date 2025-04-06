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
import {
  Bot,
  Code,
  Description,
  Solutions,
  Submissions,
  Testcase,
  TestResult,
} from "@/app/(app)/problems/[id]/features";
import DockView from "@/components/dockview";

export default function ProblemPage() {
  return (
    <DockView
      storageKey="dockview:problem"
      components={{
        Description: () => <Description />,
        Solutions: () => <Solutions />,
        Submissions: () => <Submissions />,
        Code: () => <Code />,
        Testcase: () => <Testcase />,
        TestResult: () => <TestResult />,
        Bot: () => <Bot />,
      }}
      options={[
        {
          id: "Description",
          component: "Description",
          title: "Description",
          params: { icon: FileTextIcon },
        },
        {
          id: "Solutions",
          component: "Solutions",
          title: "Solutions",
          params: { icon: FlaskConicalIcon },
          position: {
            referencePanel: "Description",
            direction: "within"
          },
        },
        {
          id: "Submissions",
          component: "Submissions",
          title: "Submissions",
          params: { icon: CircleCheckBigIcon },
          position: {
            referencePanel: "Solutions",
            direction: "within"
          },
        },
        {
          id: "Code",
          component: "Code",
          title: "Code",
          params: { icon: SquarePenIcon },
          position: {
            referencePanel: "Submissions",
            direction: "right"
          },
        },
        {
          id: "Bot",
          component: "Bot",
          title: "Bot",
          params: { icon: BotIcon },
          position: {
            referencePanel: "Code",
            direction: "right"
          },
        },
        {
          id: "Testcase",
          component: "Testcase",
          title: "Testcase",
          params: { icon: SquareCheckIcon },
          position: {
            referencePanel: "Code",
            direction: "below"
          },
        },
        {
          id: "TestResult",
          component: "TestResult",
          title: "Test Result",
          params: { icon: TerminalIcon },
          position: {
            referencePanel: "Testcase",
            direction: "within"
          },
        },
      ]}
    />
  );
}
