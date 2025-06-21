import { ProtectedLayout } from "@/features/dashboard/layouts/protected-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ProtectedLayout roles={["ADMIN", "TEACHER", "GUEST"]}>
      {children}
    </ProtectedLayout>
  );
};

export default Layout;
