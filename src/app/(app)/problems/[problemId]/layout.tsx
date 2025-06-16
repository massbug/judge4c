import { notFound } from "next/navigation";
import { ProblemHeader } from "@/features/problems/components/header";

interface ProblemLayoutProps {
  children: React.ReactNode;
  params: Promise<{ problemId: string }>;
}

export default async function ProblemLayout({
  children,
  params,
}: ProblemLayoutProps) {
  const { problemId } = await params;

  if (!problemId) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <ProblemHeader />
      <div className="flex w-full flex-grow overflow-y-hidden p-2.5 pt-0">
        {children}
      </div>
    </div>
  );
}
