interface ProblemSolutionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemSolutionLayout({
  children,
}: ProblemSolutionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      {children}
    </div>
  );
}
