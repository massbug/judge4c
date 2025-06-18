import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 获取所有管理员
export async function GET() {
  const users = await prisma.user.findMany({ where: { role: "ADMIN" } });
  return NextResponse.json(users);
}

// 新建管理员
export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  data.role = "ADMIN";
  const user = await prisma.user.create({ data });
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}

// 编辑管理员
export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  data.role = "ADMIN";
  const user = await prisma.user.update({
    where: { id: data.id },
    data,
  });
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}

// 删除管理员
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 