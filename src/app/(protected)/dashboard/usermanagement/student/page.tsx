import { studentConfig } from "@/features/user-management/config/student";
import GenericPage from "@/features/user-management/components/generic-page";

export default function StudentPage() {
  return <GenericPage resourceType="student" config={studentConfig} />;
}
