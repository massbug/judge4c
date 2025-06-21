// updateUserInfo.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updateUserInfo(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    throw new Error("缺少必要字段：name, email");
  }

  try {
    // 获取当前会话
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("用户未登录");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return updatedUser;
  } catch (error) {
    console.error("更新用户信息失败:", error);
    throw new Error("更新用户信息失败");
  }
}