import GenericPage from '@/features/user-management/components/generic-page'
import { adminConfig } from '@/features/user-management/config/admin'

export default function AdminPage() {
  return <GenericPage userType="admin" config={adminConfig} />
} 