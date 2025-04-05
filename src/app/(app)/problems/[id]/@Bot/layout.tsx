interface BotLayoutProps {
  children: React.ReactNode;
}

export default function BotLayout({
  children,
}: BotLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 border-x border-muted">
        {children}
      </div>
    </div>
  );
}
