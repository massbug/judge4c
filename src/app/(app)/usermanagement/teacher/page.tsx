import { UserTable } from '@/features/user-management/components/user-table'
import { teacherConfig } from '@/features/user-management/config/teacher'
import prisma from '@/lib/prisma'
import type { User } from '@/generated/client'

export default async function TeacherPage() {
  const data: User[] = await prisma.user.findMany({ where: { role: 'TEACHER' } })
  return <UserTable config={teacherConfig} data={data} />
} 