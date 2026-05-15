"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@/generated/client";
import { revalidatePath } from "next/cache";
import type { User } from "@/generated/client";

type ResourceType = "admin" | "teacher" | "student";

export async function createUser(
  resourceType: ResourceType,
  data: Omit<User, "id" | "createdAt" | "updatedAt"> & { password?: string }
) {
  let password = data.password;
  if (password) {
    password = await bcrypt.hash(password, 10);
  }

  const role = resourceType.toUpperCase() as Role;
  await prisma.user.create({ data: { ...data, password, role } });
  revalidatePath(`/usermanagement/${resourceType}`);
}

export async function updateUser(
  resourceType: ResourceType,
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
) {
  const updateData = { ...data };

  // 如果包含密码字段且不为空，则进行加密
  if (data.password && data.password.trim() !== "") {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    // 如果密码为空，则从更新数据中移除密码字段，保持原密码不变
    delete updateData.password;
  }

  await prisma.user.update({ where: { id }, data: updateData });
  revalidatePath(`/usermanagement/${resourceType}`);
}

export async function deleteUser(resourceType: ResourceType, id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath(`/usermanagement/${resourceType}`);
}
