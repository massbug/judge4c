import * as React from "react";
import { ChevronRight } from "lucide-react";

import { VersionSwitcher } from "@/components/manage-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// 自定义数据：包含用户相关菜单项
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navUser: [
    {
      title: "个人中心",
      url: "#",
      items: [
        { title: "登录信息", url: "#", key: "profile" },
        { title: "修改密码", url: "#", key: "change-password" },
      ],
    },
  ],
};

// 显式定义 props 类型
interface AppSidebarProps {
  onItemClick?: (key: string) => void;
}

export function AppSidebar({ onItemClick = (key: string) => {}, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* 渲染用户相关的侧边栏菜单 */}
        {data.navUser.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          onClick={(e) => {
                            e.preventDefault();
                            onItemClick(subItem.key);
                          }}
                        >
                          <a href="#">{subItem.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}