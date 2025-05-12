"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { LocaleSwitcher } from "@/components/locale-switcher";
import AppearanceSettings from "@/components/appearance-settings";
import { CodeXml, Globe, Paintbrush, Settings } from "lucide-react";

export const SettingsDialog = () => {
  const t = useTranslations("SettingsDialog");
  const data = {
    nav: [
      { id: "Appearance", name: t("nav.Appearance"), icon: Paintbrush },
      { id: "Language", name: t("nav.Language"), icon: Globe },
      { id: "CodeEditor", name: t("nav.CodeEditor"), icon: CodeXml },
      { id: "Advanced", name: t("nav.Advanced"), icon: Settings },
    ],
  };
  const { isDialogOpen, activeSetting, setDialogOpen, setActiveSetting } =
    useSettingsStore();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="pt-2">
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.id === activeSetting}
                          onClick={() => setActiveSetting(item.id)}
                        >
                          <a>
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>{t("breadcrumb")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {t(`nav.${activeSetting}`)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <ScrollArea className="flex-1 overflow-y-auto p-4 pt-0">
              <div className="flex flex-col gap-4">
                {activeSetting === "Appearance" && <AppearanceSettings />}
                {activeSetting === "Language" && <LocaleSwitcher />}
              </div>
            </ScrollArea>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
};
