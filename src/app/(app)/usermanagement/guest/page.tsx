import { UserTable } from '@/features/user-management/components/user-table'
import { guestConfig } from '@/features/user-management/config/guest'
import prisma from '@/lib/prisma'
import type { User } from '@/generated/client'

export default async function GuestPage() {
  const data: User[] = await prisma.user.findMany({ where: { role: 'GUEST' } })
  return <UserTable config={guestConfig} data={data} />
} 