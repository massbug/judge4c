// changePassword.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!oldPassword || !newPassword) {
    throw new Error("旧密码和新密码不能为空");
  }

  try {
    // 获取当前登录用户
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("用户未登录");
    }

    // 查询当前用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("用户不存在");
    }

    if (!user.password) {
      throw new Error("用户密码未设置");
    }

    // 验证旧密码
    const passwordHash: string = user.password as string;
    const isMatch = await bcrypt.compare(oldPassword, passwordHash);
    if (!isMatch) {
      throw new Error("旧密码错误");
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("修改密码失败:", error);
    throw new Error("修改密码失败");
  }
}