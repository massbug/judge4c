import { UserTable } from '@/features/user-management/components/user-table'
import { adminConfig } from '@/features/user-management/config/admin'
import prisma from '@/lib/prisma'
import type { User } from '@/generated/client'

export default async function AdminPage() {
  const data: User[] = await prisma.user.findMany({ where: { role: 'ADMIN' } })
  return <UserTable config={adminConfig} data={data} />
} 