import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PlaygroundHeader } from "@/features/playground/header";

interface PlaygroundLayoutProps {
  problem: React.ReactNode;
  workspace: React.ReactNode;
}

export default function PlaygroundLayout({
  problem,
  workspace,
}: PlaygroundLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <PlaygroundHeader />
      <ResizablePanelGroup direction="horizontal" className="p-2.5 pt-0">
        <ResizablePanel
          defaultSize={50}
          className="border border-muted rounded-2xl"
        >
          {problem}
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="w-0.5 bg-transparent hover:bg-blue-500 mx-1"
        />
        <ResizablePanel
          defaultSize={50}
          className="border border-muted rounded-2xl"
        >
          {workspace}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
