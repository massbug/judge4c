import { UserTable } from './user-table'
import { UserConfig } from './user-table'
import prisma from '@/lib/prisma'
import type { User, Problem } from '@/generated/client'
import { Role } from '@/generated/client'

interface GenericPageProps {
  userType: 'admin' | 'teacher' | 'guest' | 'problem'
  config: UserConfig
}

export default async function GenericPage({ userType, config }: GenericPageProps) {
  if (userType === 'problem') {
    const data: Problem[] = await prisma.problem.findMany({})
    return <UserTable config={config} data={data} />
  } else {
    const role = userType.toUpperCase() as Role
    const data: User[] = await prisma.user.findMany({ where: { role } })
    return <UserTable config={config} data={data} />
  }
} 