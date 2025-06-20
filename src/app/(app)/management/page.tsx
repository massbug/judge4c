"use client"
import React, { useState } from "react"
import { AppSidebar } from "@/components/management-sidebar/manage-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ProfilePage from "./profile/page"
import ChangePasswordPage from "./change-password/page"

// 模拟菜单数据
const menuItems = [
  { title: "登录信息", key: "profile" },
  { title: "修改密码", key: "change-password" },
]

export default function ManagementDefaultPage() {
  const [activePage, setActivePage] = useState("profile")
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* 左侧侧边栏 */}
        {!isCollapsed && (
          <div className="w-64 border-r bg-background flex-shrink-0 p-4">
            <AppSidebar onItemClick={setActivePage} />
          </div>
        )}

        {/* 右侧主内容区域 */}
        <SidebarInset className="h-full w-full overflow-auto">
          <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            {/* 折叠按钮 */}
            <SidebarTrigger className="-ml-1" onClick={toggleSidebar} />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* 面包屑导航 */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/management">管理面板</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {menuItems.find((item) => item.key === activePage)?.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          {/* 主体内容：根据 isCollapsed 切换样式 */}
          <main
            className={`flex-1 p-6 bg-background transition-all duration-300 ${
              isCollapsed ? "w-full" : "md:w-[calc(100%-16rem)]"
            }`}
          >
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}