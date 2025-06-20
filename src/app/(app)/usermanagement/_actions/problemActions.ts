'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Problem } from '@/generated/client'

export async function createProblem(data: Omit<Problem, 'id'|'createdAt'|'updatedAt'>) {
  await prisma.problem.create({ data })
  revalidatePath('/usermanagement/problem')
}

export async function updateProblem(id: string, data: Partial<Omit<Problem, 'id'|'createdAt'|'updatedAt'>>) {
  await prisma.problem.update({ where: { id }, data })
  revalidatePath('/usermanagement/problem')
}

export async function deleteProblem(id: string) {
  await prisma.problem.delete({ where: { id } })
  revalidatePath('/usermanagement/problem')
} 