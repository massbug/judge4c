"use client"
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
// 仅保留实际使用的组件导入
import {
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Command,
  PieChart,
  Settings2,
} from "lucide-react";

// 添加缺失的AppSidebar导入
import { AppSidebar as BaseAppSidebar } from "@/components/app-sidebar";

import { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";

// 如果 adminData.teams 没有在别处定义，请取消注释下面的代码并提供实际值
/*
const teams = [
  // 在这里放置你的团队数据
];
*/


const adminData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Settings2,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
        {
          title: "Users",
          url: "/admin/users",
        },
        {
          title: "Problems",
          url: "/admin/problems",
        },
      ],
    },
  ],
  projects: [
    {
      name: "System Monitoring",
      url: "/admin/monitoring",
      icon: PieChart,
    },
    {
      name: "Admin Tools",
      url: "/admin/tools",
      icon: Command,
    },
  ]
};

export function AdminSidebar() {
  const { data: session } = useSession();
  const [userAvatar, setUserAvatar] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (session?.user?.email) {
        const prisma = new PrismaClient();
        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { image: true }
          });
          setUserAvatar(user?.image || "");
        } catch (error) {
          console.error("Failed to fetch user avatar:", error);
        } finally {
          await prisma.$disconnect();
        }
      }
    };

    fetchUserAvatar();
  }, [session?.user?.email]);

  const user = {
    name: session?.user?.name || "Admin",
    email: session?.user?.email || "admin@example.com",
    avatar: userAvatar
  };
  const adminNavItems = adminData.navMain.map((item) => ({
    ...item,
    items: item.items.map((subItem) => ({
      ...subItem,
      active: subItem.url === pathname,
    })),
  }));
  return (
    <BaseAppSidebar user={user}>
      {/*<SidebarHeader>*/}
      {/*  <TeamSwitcher teams={adminData.teams} />*/}
      {/*</SidebarHeader>*/}
      <SidebarContent>
        <NavMain items={adminNavItems} />
        {/* 添加监控菜单项 */}
        <div className="py-2">
          <a
            href="/admin/monitoring"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" x2="12" y1="22.08" y2="12"></line>
            </svg>
            数据分析
          </a>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </BaseAppSidebar>
  );
}
