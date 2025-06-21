import GenericLayout from "../components/GenericLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GenericLayout allowedRoles={["ADMIN"]}>{children}</GenericLayout>;
}
