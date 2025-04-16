import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface SolutionsLayoutProps {
  children: React.ReactNode;
}

export default async function SolutionsLayout({ children }: SolutionsLayoutProps) {
  return (
    <div className="flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
