// getUserInfo.ts
"use server";

import  prisma  from "@/lib/prisma";

export async function getUserInfo() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: 'user_001' },
    });

    if (!user) throw new Error("用户不存在");

    return user;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    throw new Error("获取用户信息失败");
  }
}