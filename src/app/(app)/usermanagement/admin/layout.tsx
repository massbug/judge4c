import ProtectedLayout from "../_components/ProtectedLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout allowedRoles={["ADMIN"]}>{children}</ProtectedLayout>;
} 