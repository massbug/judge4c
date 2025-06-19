"use client"

import {
  BookX,
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  Check,
  X,
  Info,
  AlertTriangle,
} from "lucide-react"
import React, { useState } from "react"
import {
  Dialog,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { WrongbookDialog } from "@/components/UncompletedProject/wrongbook-dialog"
import { ShareDialogContent } from "@/components/UncompletedProject/sharedialog"

export function NavProjects({
  projects,
}: {
  projects: {
    id: string
    name: string
    status: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [shareOpen, setShareOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>待完成项目</SidebarGroupLabel>
        <SidebarMenu>
          {projects.slice(0, 1).map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <a href={`/problem/${item.id}`}>
                  <BookX />
                  <span className="flex w-full items-center">
                    <span
                      className="truncate max-w-[120px] flex-1"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    {(() => {
                      if (item.status === "AC") {
                        return (
                          <span className="ml-2 min-w-[60px] text-xs text-right px-2 py-0.5 rounded-full border flex items-center gap-1 border-green-500 bg-green-500 text-white">
                            <Check className="w-3 h-3" />
                            {item.status}
                          </span>
                        )
                      } else if (item.status === "WA") {
                        return (
                          <span className="ml-2 min-w-[60px] text-xs text-right px-2 py-0.5 rounded-full border flex items-center gap-1 border-red-500 bg-red-500 text-white">
                            <X className="w-3 h-3" />
                            {item.status}
                          </span>
                        )
                      } else if (["RE", "CE", "MLE", "TLE"].includes(item.status)) {
                        return (
                          <span className="ml-2 min-w-[60px] text-xs text-right px-2 py-0.5 rounded-full border flex items-center gap-1 border-orange-500 bg-orange-500 text-white">
                            <AlertTriangle className="w-3 h-3" />
                            {item.status}
                          </span>
                        )
                      } else {
                        return (
                          <span className="ml-2 min-w-[60px] text-xs text-right px-2 py-0.5 rounded-full border flex items-center gap-1 border-gray-400 bg-gray-100 text-gray-700">
                            <Info className="w-3 h-3" />
                            {item.status}
                          </span>
                        )
                      }
                    })()}
                  </span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>查看</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setShareLink(`${window.location.origin}/problem/${item.id}`)
                      setShareOpen(true)
                    }}
                  >
                    <Share className="text-muted-foreground mr-2" />
                    <span>复制链接</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>移除</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <WrongbookDialog problems={projects}>
              <SidebarMenuButton>
                <MoreHorizontal />
                <span>更多</span>
              </SidebarMenuButton>
            </WrongbookDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <ShareDialogContent link={shareLink} />
      </Dialog>
    </>
  )
}