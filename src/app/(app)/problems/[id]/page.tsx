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
        },
        {
          id: "Solutions",
          component: "Solutions",
          title: "Solutions",
          position: { referencePanel: "Description", direction: "within" },
        },
        {
          id: "Submissions",
          component: "Submissions",
          title: "Submissions",
          position: { referencePanel: "Solutions", direction: "within" },
        },
        {
          id: "Code",
          component: "Code",
          title: "Code",
          position: { referencePanel: "Submissions", direction: "right" },
        },
        {
          id: "Bot",
          component: "Bot",
          title: "Bot",
          position: { referencePanel: "Code", direction: "right" },
        },
        {
          id: "Testcase",
          component: "Testcase",
          title: "Testcase",
          position: { referencePanel: "Code", direction: "below" },
        },
        {
          id: "TestResult",
          component: "TestResult",
          title: "Test Result",
          position: { referencePanel: "Testcase", direction: "within" },
        },
      ]}
    />
  );
}
