import { AdminProtectedLayout } from "@/features/admin/ui/layouts/admin-protected-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <AdminProtectedLayout>{children}</AdminProtectedLayout>;
};

export default Layout; 