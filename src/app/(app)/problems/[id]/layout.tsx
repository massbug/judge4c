import { notFound } from "next/navigation";
import { ProblemHeader } from "@/features/problems/components/problem-header";

interface ProblemLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProblemLayout({
  children,
  params,
}: ProblemLayoutProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      <ProblemHeader />
      {children}
    </div>
  );
}
