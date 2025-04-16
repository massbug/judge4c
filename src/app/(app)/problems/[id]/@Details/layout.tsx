import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface DetailsLayoutProps {
  children: React.ReactNode;
}

export default async function DetailsLayout({ children }: DetailsLayoutProps) {
  return (
    <div className="flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
