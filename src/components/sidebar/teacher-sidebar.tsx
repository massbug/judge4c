"use client"
import { siteConfig } from "@/config/site"
import * as React from "react"
import {
  Command,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
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

const data = {
  user: {
    name: "teacher",
    email: "teacher@example.com",
    avatar: "/avatars/teacher.jpg",
  },
  navMain: [
    {
      title: "教师首页",
      url: "/teacher/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "课程管理",
          url: "/teacher/courses",
        },
        {
          title: "学生管理",
          url: "/teacher/students",
        },
        {
          title: "题库管理",
          url: "/teacher/problems",
        },
      ],
    },
    {
      title: "统计分析",
      url: "/teacher/statistics",
      icon: PieChart,
      items: [
        {
          title: "成绩统计",
          url: "/teacher/statistics/grades",
        },
        {
          title: "错题分析",
          url: "/teacher/statistics/activity",
        },
      ],
    },
    {
      title: "设置",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "一般设置",
          url: "/teacher/profile",
        },
        {
          title: "语言",
          url: "/teacher/settings",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "帮助",
      url: "/",
      icon: LifeBuoy,
    },
    {
      title: "反馈",
      url: siteConfig.url.repo.github,
      icon: Send,
    },
  ],
}

export function TeacherSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Judge4c 教师端</span>
                  <span className="truncate text-xs">Teaching Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* 教师端可自定义更多内容 */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
