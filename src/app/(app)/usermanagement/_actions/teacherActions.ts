'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import type { User } from '@/generated/client'

export async function createTeacher(data: Omit<User, 'id'|'createdAt'|'updatedAt'> & { password?: string }) {
  let password = data.password
  if (password) {
    password = await bcrypt.hash(password, 10)
  }
  await prisma.user.create({ data: { ...data, password, role: 'TEACHER' } })
  revalidatePath('/usermanagement/teacher')
}

export async function updateTeacher(id: string, data: Partial<Omit<User, 'id'|'createdAt'|'updatedAt'>>) {
  let updateData = { ...data }
  
  // 如果包含密码字段且不为空，则进行加密
  if (data.password && data.password.trim() !== '') {
    updateData.password = await bcrypt.hash(data.password, 10)
  } else {
    // 如果密码为空，则从更新数据中移除密码字段，保持原密码不变
    delete updateData.password
  }
  
  await prisma.user.update({ where: { id }, data: updateData })
  revalidatePath('/usermanagement/teacher')
}

export async function deleteTeacher(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/usermanagement/teacher')
} 