import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface SolutionsLayoutProps {
  children: React.ReactNode;
}

export default async function SolutionsLayout({ children }: SolutionsLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
