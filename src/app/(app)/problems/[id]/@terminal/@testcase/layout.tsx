interface TerminalTestcaseLayoutProps {
  children: React.ReactNode;
}

export default function TerminalTestcaseLayout({
  children,
}: TerminalTestcaseLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
