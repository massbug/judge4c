import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface ProblemDescriptionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemDescriptionLayout({
  children,
}: ProblemDescriptionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
