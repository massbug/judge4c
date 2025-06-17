import { ProblemsetHeader } from "@/features/problemset/components/header";

interface ProblemsetLayoutProps {
  children: React.ReactNode;
}

export default function ProblemsetLayout({ children }: ProblemsetLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <ProblemsetHeader />
      {children}
    </div>
  );
}