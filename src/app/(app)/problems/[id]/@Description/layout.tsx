import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface DescriptionLayoutProps {
  children: React.ReactNode;
}

export default function DescriptionLayout({ children }: DescriptionLayoutProps) {
  return (
    <div className="h-full flex flex-col border border-t-0 border-muted rounded-b-3xl bg-background">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
