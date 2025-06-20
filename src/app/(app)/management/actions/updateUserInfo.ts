// updateUserInfo.ts
"use server";

import  prisma  from "@/lib/prisma";

export async function updateUserInfo(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    throw new Error("缺少必要字段：name, email");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: 'user_001' },
      data: { name, email },
    });

    return updatedUser;
  } catch (error) {
    console.error("更新用户信息失败:", error);
    throw new Error("更新用户信息失败");
  }
}