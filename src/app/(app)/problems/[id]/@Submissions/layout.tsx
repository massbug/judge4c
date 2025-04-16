import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface SubmissionsLayoutProps {
  children: React.ReactNode;
}

export default function SubmissionsLayout({ children }: SubmissionsLayoutProps) {
  return (
    <div className="flex flex-col h-full px-3 border border-t-0 border-muted rounded-b-3xl bg-background">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
