import { teacherConfig } from "@/features/user-management/config/teacher";
import GenericPage from "@/features/user-management/components/generic-page";

export default function TeacherPage() {
  return <GenericPage userType="teacher" config={teacherConfig} />;
}
