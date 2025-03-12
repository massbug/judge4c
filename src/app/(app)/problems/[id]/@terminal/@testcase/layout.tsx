import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface TerminalTestcaseLayoutProps {
  children: React.ReactNode;
}

export default function TerminalTestcaseLayout({
  children,
}: TerminalTestcaseLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
