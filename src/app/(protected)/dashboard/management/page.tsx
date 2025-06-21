"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import ProfilePage from "./profile/page";
import { Button } from "@/components/ui/button";
import ChangePasswordPage from "./change-password/page";

export default function ManagementDefaultPage() {
  const [activePage, setActivePage] = useState("profile");

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return <ProfilePage />;
      case "change-password":
        return <ChangePasswordPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {/* 页面切换按钮 */}
        <div className="ml-auto flex space-x-2">
          <Button
            className={cn("px-3 py-1 rounded-md text-sm transition-colors")}
            variant={activePage === "profile" ? "default" : "secondary"}
            onClick={() => setActivePage("profile")}
          >
            登录信息
          </Button>
          <Button
            className={cn("px-3 py-1 rounded-md text-sm transition-colors")}
            variant={activePage === "change-password" ? "default" : "secondary"}
            onClick={() => setActivePage("change-password")}
          >
            修改密码
          </Button>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
