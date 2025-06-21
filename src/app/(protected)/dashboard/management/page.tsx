"use client"
import React, { useState } from "react"
import { Separator } from "@/components/ui/separator"
import ProfilePage from "./profile/page"
import ChangePasswordPage from "./change-password/page"

export default function ManagementDefaultPage() {
  const [activePage, setActivePage] = useState("profile")

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return <ProfilePage />
      case "change-password":
        return <ChangePasswordPage />
      default:
        return <ProfilePage />
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* 页面切换按钮 */}
        <div className="ml-auto flex space-x-2">
          <button
            onClick={() => setActivePage("profile")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              activePage === "profile"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            登录信息
          </button>
          <button
            onClick={() => setActivePage("change-password")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              activePage === "change-password"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            修改密码
          </button>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}