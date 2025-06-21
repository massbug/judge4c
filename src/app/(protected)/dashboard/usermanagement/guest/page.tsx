import { guestConfig } from "@/features/user-management/config/guest";
import GenericPage from "@/features/user-management/components/generic-page";

export default function GuestPage() {
  return <GenericPage userType="guest" config={guestConfig} />;
}
