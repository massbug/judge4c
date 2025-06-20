'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProblem(data) {
  await prisma.problem.create({ data })
  revalidatePath('/usermanagement/problem')
}

export async function updateProblem(id, data) {
  await prisma.problem.update({ where: { id }, data })
  revalidatePath('/usermanagement/problem')
}

export async function deleteProblem(id) {
  await prisma.problem.delete({ where: { id } })
  revalidatePath('/usermanagement/problem')
} 