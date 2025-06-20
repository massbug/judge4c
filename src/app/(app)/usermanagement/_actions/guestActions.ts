'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function createGuest(data) {
  let password = data.password
  if (password) {
    password = await bcrypt.hash(password, 10)
  }
  await prisma.user.create({ data: { ...data, password, role: 'GUEST' } })
  revalidatePath('/usermanagement/guest')
}

export async function updateGuest(id, data) {
  await prisma.user.update({ where: { id }, data })
  revalidatePath('/usermanagement/guest')
}

export async function deleteGuest(id) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/usermanagement/guest')
} 