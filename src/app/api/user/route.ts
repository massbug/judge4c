import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

// 获取所有用户
export async function GET() {
  try {
    // 验证管理员权限
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true, // 包含密码字段用于处理
      }
    });
    
    // 在服务器端处理密码显示逻辑
    const processedUsers = users.map(user => ({
      ...user,
      password: user.password ? "******" : "(无)", // 服务器端处理密码显示
      createdAt: user.createdAt instanceof Date ? user.createdAt.toLocaleString() : user.createdAt, // 服务器端处理日期格式
    }));
    
    return NextResponse.json(processedUsers);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 新建用户
export async function POST(req: NextRequest) {
  try {
    // 验证管理员权限
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const data = await req.json();
    
    // 如果提供了密码，进行加密
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const newUser = await prisma.user.create({ 
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      }
    });
    
    // 处理返回数据
    const processedUser = {
      ...newUser,
      password: newUser.password ? "******" : "(无)",
      createdAt: newUser.createdAt instanceof Date ? newUser.createdAt.toLocaleString() : newUser.createdAt,
    };
    
    return NextResponse.json(processedUser);
  } catch (error) {
    console.error("创建用户失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 编辑用户
export async function PUT(req: NextRequest) {
  try {
    // 验证管理员权限
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const data = await req.json();
    
    // 如果提供了密码且不为空，进行加密
    if (data.password && data.password.trim() !== '') {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      // 如果密码为空，则不更新密码字段
      delete data.password;
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      }
    });
    
    // 处理返回数据
    const processedUser = {
      ...updatedUser,
      password: updatedUser.password ? "******" : "(无)",
      createdAt: updatedUser.createdAt instanceof Date ? updatedUser.createdAt.toLocaleString() : updatedUser.createdAt,
    };
    
    return NextResponse.json(processedUser);
  } catch (error) {
    console.error("更新用户失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(req: NextRequest) {
  try {
    // 验证管理员权限
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 });
    }

    const { id } = await req.json();
    
    // 防止删除自己
    if (id === session.user.id) {
      return NextResponse.json({ error: "不能删除自己的账户" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除用户失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
} 