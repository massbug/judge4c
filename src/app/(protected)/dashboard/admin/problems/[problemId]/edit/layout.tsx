import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ problemId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { problemId } = await params;

  if (!problemId) {
    return notFound();
  }

  return <>{children}</>;
};

export default Layout;
