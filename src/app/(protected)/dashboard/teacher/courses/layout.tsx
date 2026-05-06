import { ProtectedLayout } from "@/features/dashboard/layouts/protected-layout";

export default async function TeacherCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout roles={["TEACHER", "ADMIN"]}>{children}</ProtectedLayout>;
}
