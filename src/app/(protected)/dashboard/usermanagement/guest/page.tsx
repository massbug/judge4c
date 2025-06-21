import GenericPage from '@/features/user-management/components/generic-page'
import { guestConfig } from '@/features/user-management/config/guest'

export default function GuestPage() {
  return <GenericPage userType="guest" config={guestConfig} />
} 