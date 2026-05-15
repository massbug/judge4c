import { adminConfig } from "@/features/user-management/config/admin";
import GenericPage from "@/features/user-management/components/generic-page";

export default function AdminPage() {
  return <GenericPage resourceType="admin" config={adminConfig} />;
}
