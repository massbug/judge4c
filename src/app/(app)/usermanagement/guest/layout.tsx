import GenericLayout from "../_components/GenericLayout";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout allowedRoles={["ADMIN", "TEACHER"]}>{children}</GenericLayout>;
} 