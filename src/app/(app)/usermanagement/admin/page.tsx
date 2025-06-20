import { UserTable } from '@/features/user-management/components/user-table'
import { adminConfig } from '@/features/user-management/config/admin'
import prisma from '@/lib/prisma'

export default async function AdminPage() {
  const data = await prisma.user.findMany({ where: { role: 'ADMIN' } })
  return <UserTable config={adminConfig} data={data} />
} 