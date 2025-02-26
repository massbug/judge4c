import ProblemSolutionFooter from "./components/footer";

interface ProblemSolutionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemSolutionLayout({
  children,
}: ProblemSolutionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      <ProblemSolutionFooter />
    </div>
  );
}
