"use client"
import { siteConfig } from "@/config/site"
import * as React from "react"
import {
  LifeBuoy,
  Send,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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

import { useEffect, useState } from "react"

const adminData = {
  navMain: [
    {
      title: "管理面板",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        { title: "管理员管理", url: "/usermanagement/admin" },
        { title: "用户管理", url: "/usermanagement/guest" },
        { title: "教师管理", url: "/usermanagement/teacher" },
        { title: "题目管理", url: "/usermanagement/problem" },
      ],
    },
   
  ],
  navSecondary: [
    { title: "帮助", url: "/", icon: LifeBuoy },
    { title: "反馈", url: siteConfig.url.repo.github, icon: Send },
  ],
  wrongProblems: [],
}

async function fetchCurrentUser() {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const session = await res.json();
    return {
      name: session?.user?.name ?? "未登录管理员",
      email: session?.user?.email ?? "",
      avatar: session?.user?.image ?? "/avatars/default.jpg",
    };
  } catch {
    return {
      name: "未登录管理员",
      email: "",
      avatar: "/avatars/default.jpg",
    };
  }
}

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "未登录管理员",
    email: "",
    avatar: "/avatars/default.jpg",
  });

  useEffect(() => {
    fetchCurrentUser().then(u => u && setUser(u));
  }, []);

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
        <NavProjects projects={adminData.wrongProblems} />
        <NavSecondary items={adminData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
