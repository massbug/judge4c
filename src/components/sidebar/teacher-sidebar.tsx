"use client";

import { Command, LifeBuoy, Send, Shield } from "lucide-react";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { siteConfig } from "@/config/site";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavSecondary } from "@/components/nav-secondary";

const data = {
  navMain: [
    {
      title: "管理面板",
      url: "/dashboard",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "用户管理",
          url: "/dashboard/usermanagement/guest",
        },
        {
          title: "题目管理",
          url: "/dashboard/usermanagement/problem",
        },
        {
          title: "完成情况",
          url: "/dashboard/teacher/dashboard",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "帮助",
      url: `${siteConfig.url.repo.github}/issues`,
      icon: LifeBuoy,
    },
    {
      title: "反馈",
      url: `${siteConfig.url.repo.github}/pulls`,
      icon: Send,
    },
  ],
};

interface TeacherSidebarProps {
  user: User;
}

export function TeacherSidebar({
  user,
  ...props
}: TeacherSidebarProps & React.ComponentProps<typeof Sidebar>) {
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
  );
}
