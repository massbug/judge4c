"use client";

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
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { Command, LifeBuoy, Send, SquareTerminal } from "lucide-react";

const data = {
  navMain: [
    {
      title: "页面",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "主页",
          url: "/dashboard/student/dashboard",
        },
        {
          title: "题目集",
          url: "/problemset",
        },
      ],
    },

    // {
    //   title: "已完成事项",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "全部编程集",
    //       url: "#",
    //     },
    //     {
    //       title: "错题集",
    //       url: "#",
    //     },
    //     {
    //       title: "收藏集",
    //       url: "#",
    //     },
    //   ],
    // },
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
};

interface AppSidebarProps {
  user: User;
  wrongProblems: {
    id: string;
    name: string;
    status: string;
  }[];
}

export function AppSidebar({ user, wrongProblems, ...props }: AppSidebarProps) {
  const userInfo = {
    name: user.name ?? "",
    email: user.email ?? "",
    avatar: user.image ?? "",
  };

  return (
    <Sidebar {...props}>
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
        <NavProjects projects={wrongProblems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
