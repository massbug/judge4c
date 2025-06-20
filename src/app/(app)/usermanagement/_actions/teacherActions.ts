'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function createTeacher(data) {
  let password = data.password
  if (password) {
    password = await bcrypt.hash(password, 10)
  }
  await prisma.user.create({ data: { ...data, password, role: 'TEACHER' } })
  revalidatePath('/usermanagement/teacher')
}

export async function updateTeacher(id, data) {
  await prisma.user.update({ where: { id }, data })
  revalidatePath('/usermanagement/teacher')
}

export async function deleteTeacher(id) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/usermanagement/teacher')
} 