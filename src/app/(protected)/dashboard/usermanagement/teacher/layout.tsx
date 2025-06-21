import GenericLayout from "../_components/GenericLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <GenericLayout allowedRoles={["ADMIN"]}>{children}</GenericLayout>;
} 