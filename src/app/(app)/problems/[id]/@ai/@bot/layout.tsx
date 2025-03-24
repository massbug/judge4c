import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface AiBotLayoutProps {
  children: React.ReactNode;
}

export default function AiBotLayout({
  children,
}: AiBotLayoutProps) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}
