import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PlaygroundLayoutProps {
  description: React.ReactNode;
  workspace: React.ReactNode;
}

export default function PlaygroundLayout({
  description,
  workspace,
}: PlaygroundLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="p-2.5 pt-0">
      <ResizablePanel defaultSize={50} className="border border-muted rounded-2xl">
        {description}
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className="w-0.5 bg-transparent hover:bg-blue-500 mx-0.5"
      />
      <ResizablePanel defaultSize={50} className="border border-muted rounded-2xl">
        {workspace}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
