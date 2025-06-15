"use client"
import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavUser } from "@/components/nav-user";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";


// 如果 adminData.teams 没有在别处定义，请取消注释下面的代码并提供实际值
/*
const teams = [
  // 在这里放置你的团队数据
];
*/

// 创建图标映射
type LucideIconMap = {
  [key: string]: typeof AudioWaveform;
};

const lucideIconMap: LucideIconMap = {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
};

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

export const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Admin",
    email: session?.user?.email || "admin@example.com",
    avatar: session?.user?.avatar || ""
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