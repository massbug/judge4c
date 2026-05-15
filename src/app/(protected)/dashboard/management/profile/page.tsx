"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/app/(protected)/dashboard/management/actions/getUserInfo";
import { updateUserInfo } from "@/app/(protected)/dashboard/management/actions/updateUserInfo";

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: Date | null;
  image: string | null;
  role: "STUDENT" | "ADMIN" | "TEACHER";
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }

    fetchUser();
  }, []);

  const handleSave = async () => {
    const nameInput = document.getElementById(
      "name"
    ) as HTMLInputElement | null;
    const emailInput = document.getElementById(
      "email"
    ) as HTMLInputElement | null;

    if (!nameInput || !emailInput) {
      alert("表单元素缺失");
      return;
    }

    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("email", emailInput.value);

    try {
      const updatedUser = await updateUserInfo(formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "更新用户信息失败";
      alert(errorMessage);
    }
  };

  if (!user) return <p>加载中...</p>;

  return (
    <div className="h-full w-full p-6">
      <div className="h-full w-full bg-card shadow-lg rounded-xl p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">用户信息</h1>

        <div className="flex items-center space-x-6 mb-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              👤
            </div>
          </div>
          <div>
            {isEditing ? (
              <Input
                id="name"
                type="text"
                defaultValue={user?.name || ""}
                className="mt-1 block w-full border rounded-md p-2"
              />
            ) : (
              <h2 className="text-xl font-semibold">
                {user?.name || "未提供"}
              </h2>
            )}
            <p>角色：{user?.role}</p>
            <p>
              邮箱验证时间：
              {user.emailVerified
                ? new Date(user.emailVerified).toLocaleString()
                : "未验证"}
            </p>
          </div>
        </div>

        <hr className="border-border mb-6" />

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium">用户ID</label>
            <p className="mt-1 text-lg font-medium">{user.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">邮箱地址</label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                className="mt-1 block w-full border rounded-md p-2"
              />
            ) : (
              <p className="mt-1 text-lg font-medium">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">注册时间</label>
            <p className="mt-1 text-lg font-medium">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">最后更新时间</label>
            <p className="mt-1 text-lg font-medium">
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                type="button"
                className="px-4 py-2 rounded-md transition-colors"
              >
                取消
              </Button>
              <Button
                onClick={handleSave}
                type="button"
                variant="secondary"
                className="px-4 py-2 rounded-md transition-colors"
              >
                保存
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              type="button"
              className="px-4 py-2 rounded-md transition-colors"
            >
              编辑信息
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
