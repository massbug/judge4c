import ProtectedLayout from "../_components/ProtectedLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout allowedRoles={["ADMIN", "TEACHER"]}>{children}</ProtectedLayout>;
} 