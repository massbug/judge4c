import { PlaygroundHeader } from "@/components/features/playground/header";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface PlaygroundLayoutProps {
  problem: React.ReactNode;
  workspace: React.ReactNode;
  terminal: React.ReactNode;
}

export default function PlaygroundLayout({
  problem,
  workspace,
  terminal,
}: PlaygroundLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <PlaygroundHeader />
      <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
        <ResizablePanelGroup direction="horizontal" className="relative h-full flex">
          <ResizablePanel defaultSize={50} className="border border-muted rounded-xl min-w-9">
            {problem}
          </ResizablePanel>
          <ResizableHandle className="mx-1 bg-transparent hover:bg-blue-500" />
          <ResizablePanel defaultSize={50} className="min-w-9">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50} className="border border-muted rounded-xl min-h-9">
                {workspace}
              </ResizablePanel>
              <ResizableHandle className="my-1 bg-transparent hover:bg-blue-500" />
              <ResizablePanel defaultSize={50} className="border border-muted rounded-xl min-h-9">
                {terminal}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
