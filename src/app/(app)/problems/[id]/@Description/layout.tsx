import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface DescriptionLayoutProps {
  children: React.ReactNode;
}

export default function DescriptionLayout({ children }: DescriptionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
