// src/app/(app)/management/change-password/page.tsx
"use client";

import { useState } from "react";
import { changePassword } from "@/app/(app)/management/actions";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return "weak";
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) return "medium";
    return "strong";
  };

  const strengthText = getPasswordStrength(newPassword);
  let strengthColor = "";
  let strengthLabel = "";

  switch (strengthText) {
    case "weak":
      strengthColor = "bg-red-500";
      strengthLabel = "弱";
      break;
    case "medium":
      strengthColor = "bg-yellow-500";
      strengthLabel = "中等";
      break;
    case "strong":
      strengthColor = "bg-green-500";
      strengthLabel = "强";
      break;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("两次输入的密码不一致！");
      return;
    }

    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    try {
      await changePassword(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="h-full w-full p-6">
      <div className="h-full w-full bg-white shadow-lg rounded-xl p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">修改密码</h1>
        <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
          <div>
            <label className="block text-sm font-medium mb-1">旧密码</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {newPassword && (
              <p className="mt-1 text-xs text-gray-500">
                密码强度：
                <span className={`inline-block w-12 h-2 rounded ${strengthColor}`}></span>
                &nbsp;
                <span className="text-sm">{strengthLabel}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-500">密码不一致</p>
            )}
          </div>

          <div className="mt-auto">
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              提交
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-down">
          ✅ 密码修改成功！
        </div>
      )}
    </div>
  );
}