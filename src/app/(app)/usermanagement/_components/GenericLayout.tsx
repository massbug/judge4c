import ProtectedLayout from "./ProtectedLayout";

interface GenericLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function GenericLayout({ children, allowedRoles }: GenericLayoutProps) {
  return <ProtectedLayout allowedRoles={allowedRoles}>{children}</ProtectedLayout>;
} 