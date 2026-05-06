import { ProtectedLayout } from "@/features/dashboard/layouts/protected-layout";

export default async function StudentCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout roles={["GUEST"]}>{children}</ProtectedLayout>;
}
