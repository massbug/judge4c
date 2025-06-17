"use client"
import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Command,
  House,
  PieChart,
  Settings2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";

// 如果 adminData.teams 没有在别处定义，请取消注释下面的代码并提供实际值
/*
const teams = [
  // 在这里放置你的团队数据
];
*/


const adminData = {
  // teams: [
  //   {
  //     name: "Admin Team",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  // ],
  navMain: [
    {
      title: "OverView",
      url: "/",
      icon: House,
    },
    {
      title: "Dashboard",
      url: "/admin",
      icon: Settings2,
      items: [
        {
          title: "User",
          url: "/admin/users",
        },
        {
          title: "Teacher",
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

export const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = useSession();
  const [userAvatar, setUserAvatar] = useState("");

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
  
  return (
    <Sidebar collapsible="icon" {...props}>
      {/*<SidebarHeader>*/}
      {/*  <TeamSwitcher teams={adminData.teams} />*/}
      {/*</SidebarHeader>*/}
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavProjects projects={adminData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};