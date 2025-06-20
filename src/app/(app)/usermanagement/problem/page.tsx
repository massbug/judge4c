import { UserTable } from '@/features/user-management/components/user-table'
import { problemConfig } from '@/features/user-management/config/problem'
import prisma from '@/lib/prisma'

export default async function ProblemPage() {
  const data = await prisma.problem.findMany({})
  return <UserTable config={problemConfig} data={data} />
} 