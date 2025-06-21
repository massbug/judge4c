import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PanelLayoutProps {
  isScroll?: boolean;
  children: React.ReactNode;
}

export const PanelLayout = ({
  isScroll = true,
  children,
}: PanelLayoutProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">
          {isScroll ? (
            <ScrollArea className="h-full">
              {children}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
