"use client"
import { siteConfig } from "@/config/site"
import * as React from "react"
import {
  LifeBuoy,
  Send,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User } from "next-auth"

const adminData = {
  navMain: [
    {
      title: "管理面板",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        { title: "管理员管理", url: "/dashboard/usermanagement/admin" },
        { title: "用户管理", url: "/dashboard/usermanagement/guest" },
        { title: "教师管理", url: "/dashboard/usermanagement/teacher" },
        { title: "题目管理", url: "/dashboard/usermanagement/problem" },
      ],
    },
   
  ],
  navSecondary: [
    { title: "帮助", url: "/", icon: LifeBuoy },
    { title: "反馈", url: siteConfig.url.repo.github, icon: Send },
  ],
}

interface AdminSidebarProps {
  user: User;
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const userInfo = {
    name: user.name ?? "管理员",
    email: user.email ?? "",
    avatar: user.image ?? "/avatars/default.jpg",
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin</span>
                  <span className="truncate text-xs">管理后台</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavSecondary items={adminData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  )
}
