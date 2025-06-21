import { problemConfig } from "@/features/user-management/config/problem";
import GenericPage from "@/features/user-management/components/generic-page";

export default function ProblemPage() {
  return <GenericPage userType="problem" config={problemConfig} />;
}
