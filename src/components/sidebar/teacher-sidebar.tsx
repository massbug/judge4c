"use client"
import { siteConfig } from "@/config/site"
import * as React from "react"
import {
  Command,
  LifeBuoy,
  PieChart,
  Send,
  // Settings2,
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
import { User } from "next-auth"

const data = {
  navMain: [
    {
      title: "教师管理",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "用户管理",
          url: "/dashboard/usermanagement/guest",
        },
        {
          title: "题库管理",
          url: "/dashboard/usermanagement/problem",
        },
      ],
    },
    {
      title: "统计分析",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "完成情况",
          url: "/dashboard/teacher/dashboard",
        },
        // {
        //   title: "错题统计",
        //   url: "/dashboard/teacher/dashboard",
        // },
      ],
    },
    // {
    //   title: "设置",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "语言",
    //       url: "#",
    //     },
    //   ],
    // },
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

interface TeacherSidebarProps {
  user: User;
}

export function TeacherSidebar({ user, ...props }: TeacherSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const userInfo = {
    name: user.name ?? "",
    email: user.email ?? "",
    avatar: user.image ?? "/avatars/teacher.jpg",
  };

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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  )
}
