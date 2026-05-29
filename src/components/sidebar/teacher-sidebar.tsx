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
import { useTranslations } from "next-intl";

const data = {
  navMain: [
    {
      title: "管理面板",
      url: "/dashboard",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "学生管理",
          url: "/dashboard/usermanagement/student",
        },
        {
          title: "题目管理",
          url: "/dashboard/usermanagement/problem",
        },
        {
          title: "通过情况",
          url: "/dashboard/teacher/dashboard",
        },
        {
          title: "课程管理",
          url: "/dashboard/teacher/courses",
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
  const t = useTranslations("Sidebar");
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
                  <span className="truncate text-xs">{t("teachingTagline")}</span>
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
