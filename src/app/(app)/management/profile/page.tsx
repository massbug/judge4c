// src/app/(app)/management/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "@/app/(app)/management/actions";

interface User {
  id: string; // TEXT 类型
  name: string | null; // 可能为空
  email: string; // NOT NULL
  emailVerified: Date | null; // TIMESTAMP 转换为字符串
  image: string | null;
  role: "GUEST" | "USER" | "ADMIN"; // 枚举类型
  createdAt: Date; // TIMESTAMP 转换为字符串
  updatedAt: Date; // TIMESTAMP 转换为字符串
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
  const nameInput = document.getElementById("name") as HTMLInputElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null;

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
  } catch (error: any) {
    alert(error.message);
  }
};

  if (!user) return <p>加载中...</p>;

  return (
    <div className="h-full w-full p-6">
      <div className="h-full w-full bg-white shadow-lg rounded-xl p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">用户信息</h1>

        <div className="flex items-center space-x-6 mb-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              👤
            </div>
          </div>
          <div>
            {isEditing ? (
              <input
                id="name"
                type="text"
                defaultValue={user?.name || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user?.name || "未提供"}</h2>
            )}
            <p className="text-gray-500">角色：{user?.role}</p>
            <p className="text-gray-500">邮箱验证时间：{user.emailVerified ? new Date(user.emailVerified).toLocaleString() : "未验证"}</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">用户ID</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{user.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
            {isEditing ? (
              <input
                id="email"
                type="email"
                defaultValue={user.email}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">注册时间</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">最后更新时间</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                保存
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              type="button"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              编辑信息
            </button>
          )}
        </div>
      </div>
    </div>
  );
}