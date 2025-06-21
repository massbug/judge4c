// getUserInfo.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getUserInfo() {
  try {
    // 获取当前会话
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("用户未登录");
    }

    // 根据当前用户ID获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("用户不存在");
    }

    return user;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    throw new Error("获取用户信息失败");
  }
}