import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PlaygroundLayoutProps {
  children: React.ReactNode;
  problemDescription: React.ReactNode;
}

export default function PlaygroundLayout({
  children,
  problemDescription,
}: PlaygroundLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50}>
        {problemDescription}
      </ResizablePanel>
      <ResizableHandle withHandle className="w-0.5 hover:bg-blue-500" />
      <ResizablePanel defaultSize={50}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
