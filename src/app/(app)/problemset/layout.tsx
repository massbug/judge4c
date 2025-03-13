import { Suspense } from "react";
import { Banner } from "@/components/banner";
import { Loading } from "@/components/loading";
import { AvatarButton } from "@/components/avatar-button";

interface ProblemsetLayoutProps {
  children: React.ReactNode;
}

export default function ProblemsetLayout({ children }: ProblemsetLayoutProps) {
  return (
    <div className="relative h-screen flex flex-col">
      <Banner />
      <div className="absolute top-2 right-4">
        <AvatarButton />
      </div>
      <main className="h-full container mx-auto p-4">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
