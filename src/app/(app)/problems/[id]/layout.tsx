import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DockView from "@/components/dockview";
import { ProblemStoreProvider } from "@/providers/problem-store-provider";
import { PlaygroundHeader } from "@/components/features/playground/header";

interface ProblemProps {
  params: Promise<{ id: string }>;
  Description: React.ReactNode;
  Solutions: React.ReactNode;
  Submissions: React.ReactNode;
  Code: React.ReactNode;
  Testcase: React.ReactNode;
  TestResult: React.ReactNode;
  Bot: React.ReactNode;
}

export default async function ProblemLayout({
  params,
  Description,
  Solutions,
  Submissions,
  Code,
  Testcase,
  TestResult,
  Bot,
}: ProblemProps) {
  const { id } = await params;

  const [problemData, editorLanguageConfigs, languageServerConfigs] =
    await Promise.all([
      prisma.problem.findUnique({
        where: { id },
        include: { templates: true },
      }),
      prisma.editorLanguageConfig.findMany(),
      prisma.languageServerConfig.findMany(),
    ]);

  if (!problemData) {
    return notFound();
  }

  const { templates, ...problemWithoutTemplates } = problemData;

  return (
    <div className="flex flex-col h-screen">
      <ProblemStoreProvider
        problemId={id}
        problem={problemWithoutTemplates}
        templates={templates}
        editorLanguageConfigs={editorLanguageConfigs}
        languageServerConfigs={languageServerConfigs}
      >
        <PlaygroundHeader />
        <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
          <DockView
            storageKey="dockview:problem"
            options={[
              {
                id: "Description",
                title: "Description",
                component: "Description",
                tabComponent: "Description",
                icon: "FileTextIcon",
                node: Description,
              },
              {
                id: "Solutions",
                title: "Solutions",
                component: "Solutions",
                tabComponent: "Solutions",
                icon: "FlaskConicalIcon",
                node: Solutions,
                position: { referencePanel: "Description", direction: "within" },
              },
              {
                id: "Submissions",
                title: "Submissions",
                component: "Submissions",
                tabComponent: "Submissions",
                icon: "CircleCheckBigIcon",
                node: Submissions,
                position: { referencePanel: "Solutions", direction: "within" },
              },
              {
                id: "Code",
                title: "Code",
                component: "Code",
                tabComponent: "Code",
                icon: "SquarePenIcon",
                node: Code,
                position: { referencePanel: "Submissions", direction: "right" },
              },
              {
                id: "Bot",
                title: "Bot",
                component: "Bot",
                tabComponent: "Bot",
                icon: "BotIcon",
                node: Bot,
                position: { referencePanel: "Code", direction: "right" },
              },
              {
                id: "Testcase",
                title: "Testcase",
                component: "Testcase",
                tabComponent: "Testcase",
                icon: "SquareCheckIcon",
                node: Testcase,
                position: { referencePanel: "Code", direction: "below" },
              },
              {
                id: "TestResult",
                title: "TestResult",
                component: "TestResult",
                tabComponent: "TestResult",
                icon: "TerminalIcon",
                node: TestResult,
                position: { referencePanel: "Testcase", direction: "within" },
              },
            ]}
          />
        </main>
      </ProblemStoreProvider>
    </div>
  );
}
