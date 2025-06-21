import { notFound } from "next/navigation";
import { ProblemEditLayout } from "@/features/admin/ui/layouts/problem-edit-layout";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ problemId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { problemId } = await params;

  if (!problemId) {
    return notFound();
  }

  return <ProblemEditLayout>{children}</ProblemEditLayout>;
};

export default Layout; 