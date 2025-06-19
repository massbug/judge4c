"use client"
import { siteConfig } from "@/config/site"
import * as React from "react"
import {
  BookOpen,
  Command,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
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


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "页面",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "主页",
          url: "/student/dashboard",
        },
        {
          title: "历史记录",
          url: "#",
        },
        {
          title: "题目集",
          url: "/problemset",
        },
      ],
    },
    
    {
      title: "已完成事项",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "全部编程集",
          url: "#",
        },
        {
          title: "错题集",
          url: "#",
        },
         {
          title: "收藏集",
          url: "#",
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
          url: "#",
        },
        {
          title: "语言",
          url: "#",
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
  wrongProblems: [
    {
      id: "abc123",
      name: "Two Sum",
      status: "WA",
    },
    {
      id: "def456",
      name: "Reverse Linked List",
      status: "RE",
    },
    {
      id: "ghi789",
      name: "Binary Tree Paths",
      status: "TLE",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  <span className="truncate font-semibold">Judge4c</span>
                  <span className="truncate text-xs">Programming Learning</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.wrongProblems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}