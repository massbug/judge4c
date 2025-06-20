import { UserTable } from '@/features/user-management/components/user-table'
import { teacherConfig } from '@/features/user-management/config/teacher'
import prisma from '@/lib/prisma'

export default async function TeacherPage() {
  const data = await prisma.user.findMany({ where: { role: 'TEACHER' as any } })
  return <UserTable config={teacherConfig} data={data} />
} 