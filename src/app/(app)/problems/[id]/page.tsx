"use client";

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
import { useDockviewStore } from "@/stores/dockview";
import { DefaultDockviewOptions } from "@/config/dockview";

export default function ProblemPage() {
  const { setApi } = useDockviewStore();

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
      options={DefaultDockviewOptions.filter((panel) => panel.id !== "Bot")}
      onApiReady={setApi}
    />
  );
}
