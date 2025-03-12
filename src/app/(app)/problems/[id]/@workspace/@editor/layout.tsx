import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface WorkspaceEditorLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceEditorLayout({
  children,
}: WorkspaceEditorLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  );
}
