"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X, Info, AlertTriangle, Copy, Check as CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function WrongbookDialog({ problems, children }: { problems: { id: string; name: string; status: string; url?: string }[]; children?: React.ReactNode }) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopyLink = async (item: { id: string; url?: string }) => {
    const link = `${window.location.origin}/problems/${item.id}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000) // 2秒后重置状态
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? children : (
          <button className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90">全部错题</button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-bold">全部错题集</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-semibold">操作</th>
                  <th className="px-3 py-2 text-left font-semibold">题目名称</th>
                  <th className="px-3 py-2 text-left font-semibold">状态</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition">
                    <td className="px-3 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(item)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === item.id ? (
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="px-3 py-2">
                      <Link href={item.url || `/problems/${item.id}`} className="text-primary underline underline-offset-2 hover:text-primary/80">
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      {(() => {
                        if (item.status === "AC") {
                          return (
                            <Badge className="bg-green-500 text-white" variant="default">
                              <Check className="w-3 h-3 mr-1" />{item.status}
                            </Badge>
                          )
                        } else if (item.status === "WA") {
                          return (
                            <Badge className="bg-red-500 text-white" variant="destructive">
                              <X className="w-3 h-3 mr-1" />{item.status}
                            </Badge>
                          )
                        } else if (["RE", "CE", "MLE", "TLE"].includes(item.status)) {
                          return (
                            <Badge className="bg-orange-500 text-white" variant="secondary">
                              <AlertTriangle className="w-3 h-3 mr-1" />{item.status}
                            </Badge>
                          )
                        } else {
                          return (
                            <Badge className="bg-gray-200 text-gray-700" variant="secondary">
                              <Info className="w-3 h-3 mr-1" />{item.status}
                            </Badge>
                          )
                        }
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
