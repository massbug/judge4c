interface PanelLayoutProps {
  children: React.ReactNode;
}

export const PanelLayout = ({ children }: PanelLayoutProps) => {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-lg bg-background overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute h-full w-full">{children}</div>
      </div>
    </div>
  );
};
