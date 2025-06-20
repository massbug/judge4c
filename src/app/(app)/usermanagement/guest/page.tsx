import { UserTable } from '@/features/user-management/components/user-table'
import { guestConfig } from '@/features/user-management/config/guest'
import prisma from '@/lib/prisma'
export default async function GuestPage() {
  const data = await prisma.user.findMany({ where: { role: 'GUEST' as any } })
  return <UserTable config={guestConfig} data={data} />
} 