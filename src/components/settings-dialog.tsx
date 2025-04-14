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
import AppearanceSettings from "./appearance-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { CodeXml, Globe, Paintbrush, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

export function SettingsDialog() {
  const { isDialogOpen, activeSetting, setDialogOpen, setActiveSetting } =
      useSettingsStore();
  const t = useTranslations("settings");

  const navItems = [
    { name: t("appearance"), icon: Paintbrush },
    { name: t("language-and-region"), icon: Globe },
    { name: t("code-editor"), icon: CodeXml },
    { name: t("advanced"), icon: Settings },
  ];

  return (
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogTitle className="sr-only">{t("settings")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("customize-your-settings-here")}
          </DialogDescription>
          <SidebarProvider className="items-start">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="pt-2">
                      {navItems.map((item) => (
                          <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.name === activeSetting}
                                onClick={() => setActiveSetting(item.name)}
                            >
                              <a href="#">
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
                        <BreadcrumbLink href="#">{t("settings")}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{activeSetting}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <ScrollArea className="flex-1 overflow-y-auto p-4 pt-0">
                <div className="flex flex-col gap-4">
                  {activeSetting === t("appearance") ? (
                      <AppearanceSettings />
                  ) : (
                      Array.from({ length: 10 }).map((_, i) => (
                          <div
                              key={i}
                              className="aspect-video max-w-3xl rounded-xl bg-muted/50"
                          />
                      ))
                  )}
                </div>
              </ScrollArea>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>
  );
}
