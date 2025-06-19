import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// 获取所有题目
export async function GET() {
  try {
    // 权限校验（可选：只允许管理员/教师）
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    // 可根据需要校验角色
    // const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    // if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
    //   return NextResponse.json({ error: "权限不足" }, { status: 403 });
    // }
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        displayId: true,
        difficulty: true,
      }
    });
    return NextResponse.json(problems);
  } catch (error) {
    console.error("获取题目列表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 新建题目
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    // 只允许管理员/教师添加
    // const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    // if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
    //   return NextResponse.json({ error: "权限不足" }, { status: 403 });
    // }
    const data = await req.json();
    const newProblem = await prisma.problem.create({ data });
    return NextResponse.json(newProblem);
  } catch (error) {
    console.error("创建题目失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 编辑题目
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    // 只允许管理员/教师编辑
    // const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    // if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
    //   return NextResponse.json({ error: "权限不足" }, { status: 403 });
    // }
    const data = await req.json();
    const updatedProblem = await prisma.problem.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("更新题目失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 删除题目
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
    // 只允许管理员/教师删除
    // const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    // if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
    //   return NextResponse.json({ error: "权限不足" }, { status: 403 });
    // }
    const { id } = await req.json();
    await prisma.problem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除题目失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
} 