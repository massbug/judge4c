'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import type { User } from '@/generated/client'

export async function createAdmin(data: Omit<User, 'id'|'createdAt'|'updatedAt'> & { password?: string }) {
  let password = data.password
  if (password) {
    password = await bcrypt.hash(password, 10)
  }
  await prisma.user.create({ data: { ...data, password, role: 'ADMIN' } })
  revalidatePath('/usermanagement/admin')
}

export async function updateAdmin(id: string, data: Partial<Omit<User, 'id'|'createdAt'|'updatedAt'>>) {
  await prisma.user.update({ where: { id }, data })
  revalidatePath('/usermanagement/admin')
}

export async function deleteAdmin(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/usermanagement/admin')
} 