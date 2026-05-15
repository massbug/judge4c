import GenericLayout from "../components/GenericLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GenericLayout allowedRoles={["ADMIN", "TEACHER"]}>
      {children}
    </GenericLayout>
  );
}
