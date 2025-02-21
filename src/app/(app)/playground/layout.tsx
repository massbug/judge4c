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
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
