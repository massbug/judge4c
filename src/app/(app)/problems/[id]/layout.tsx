import { WorkspaceHeader } from "@/components/workspace-header";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface WorkspaceLayoutProps {
  problem: React.ReactNode;
  editor: React.ReactNode;
  terminal: React.ReactNode;
}

export default function WorkspaceLayout({
  problem,
  editor,
  terminal,
}: WorkspaceLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <WorkspaceHeader />
      <main className="flex flex-grow overflow-y-hidden p-2.5 pt-0">
        <ResizablePanelGroup direction="horizontal" className="relative h-full flex">
          <ResizablePanel defaultSize={50} className="border border-muted rounded-3xl">
            {problem}
          </ResizablePanel>
          <ResizableHandle className="mx-1 bg-transparent hover:bg-blue-500" />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={75} className="border border-muted rounded-3xl">
                {editor}
              </ResizablePanel>
              <ResizableHandle className="my-1 bg-transparent hover:bg-blue-500" />
              <ResizablePanel defaultSize={25} className="border border-muted rounded-3xl">
                {terminal}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
