import ProblemSubmissionFooter from "./components/footer";

interface ProblemSubmissionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemSubmissionLayout({
  children,
}: ProblemSubmissionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">{children}</div>
      <ProblemSubmissionFooter />
    </div>
  );
}
