'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function createAdmin(data) {
  let password = data.password
  if (password) {
    password = await bcrypt.hash(password, 10)
  }
  await prisma.user.create({ data: { ...data, password, role: 'ADMIN' } })
  revalidatePath('/usermanagement/admin')
}

export async function updateAdmin(id, data) {
  await prisma.user.update({ where: { id }, data })
  revalidatePath('/usermanagement/admin')
}

export async function deleteAdmin(id) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/usermanagement/admin')
} 