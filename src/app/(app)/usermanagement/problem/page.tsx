import { UserTable } from '@/features/user-management/components/user-table'
import { problemConfig } from '@/features/user-management/config/problem'
import prisma from '@/lib/prisma'
import type { Problem } from '@/generated/client'

export default async function ProblemPage() {
  const data: Problem[] = await prisma.problem.findMany({})
  return <UserTable config={problemConfig} data={data} />
} 