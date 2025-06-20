// changePassword.ts
"use server";

import prisma  from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!oldPassword || !newPassword) {
    throw new Error("旧密码和新密码不能为空");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: '1' },
    });

    if (!user) throw new Error("用户不存在");

    if (!user.password) {
      throw new Error("用户密码未设置");
    }

    const passwordHash: string = user.password as string;
    const isMatch = await bcrypt.compare(oldPassword, passwordHash);
    if (!isMatch) throw new Error("旧密码错误");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: '1' },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("修改密码失败:", error);
    throw new Error("修改密码失败");
  }
}