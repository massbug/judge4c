import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface ProblemSolutionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemSolutionLayout({
  children,
}: ProblemSolutionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
