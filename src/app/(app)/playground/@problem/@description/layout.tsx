interface ProblemDescriptionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemDescriptionLayout({
  children,
}: ProblemDescriptionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      {children}
    </div>
  );
}
