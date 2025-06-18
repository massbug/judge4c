"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ListFilter,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import * as userApi from "@/api/user"

// 定义管理员数据的 schema，与后端 User 类型保持一致
const schema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export type Admin = z.infer<typeof schema>

// 表单校验 schema
const addAdminSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址").optional().or(z.literal("")),
  password: z.string().optional(),
  createdAt: z.string().optional(),
})
type AddAdminFormData = z.infer<typeof addAdminSchema>

const editAdminSchema = z.object({
  id: z.string().min(1, "ID不能为空"),
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址").optional().or(z.literal("")),
  password: z.string().optional(),
  createdAt: z.string().optional(),
})
type EditAdminFormData = z.infer<typeof editAdminSchema>

// 生成唯一id
function generateUniqueId(existingIds: string[]): string {
  let id;
  do {
    id = 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4);
  } while (existingIds.includes(id));
  return id;
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVerticalIcon className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: Admin[]
}) {
  const [data, setData] = useState<Admin[]>(initialData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  // 搜索输入本地 state
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  // 删除确认对话框相关state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteBatch, setDeleteBatch] = useState(false)

  // 页码输入本地state
  const [pageInput, setPageInput] = useState(pagination.pageIndex + 1)
  useEffect(() => {
    setPageInput(pagination.pageIndex + 1)
  }, [pagination.pageIndex])

  const tableColumns = React.useMemo<ColumnDef<Admin>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="选择所有"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="选择行"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>姓名</span>
          <Input
            placeholder="搜索"
            className="h-6 w-24 text-xs px-1"
            value={(() => {
              const v = column.getFilterValue();
              return typeof v === 'string' ? v : '';
            })()}
            onChange={e => column.setFilterValue(e.target.value)}
            style={{ minWidth: 0 }}
          />
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>邮箱</span>
          <Input
            placeholder="搜索"
            className="h-6 w-32 text-xs px-1"
            value={(() => {
              const v = column.getFilterValue();
              return typeof v === 'string' ? v : '';
            })()}
            onChange={e => column.setFilterValue(e.target.value)}
            style={{ minWidth: 0 }}
          />
        </div>
      ),
    },
    {
      accessorKey: "password",
      header: "密码",
      cell: ({ row }) => row.getValue("password") ? "******" : "(无)",
    },
    {
      accessorKey: "createdAt",
      header: "创建时间",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return date.toLocaleString()
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => {
        const admin = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                setEditingAdmin(admin)
                setIsEditDialogOpen(true)
              }}
            >
              <PencilIcon className="size-4 mr-1" /> 编辑
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1 text-destructive hover:text-destructive" 
              onClick={() => {
                setDeleteTargetId(admin.id)
                setDeleteBatch(false)
                setDeleteDialogOpen(true)
              }}
              aria-label="Delete"
            >
              <TrashIcon className="size-4 mr-1" /> 删除
            </Button>
          </div>
        )
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // useEffect 同步 filterValue 到本地 state
  useEffect(() => {
    const v = table.getColumn("name")?.getFilterValue();
    setNameSearch(typeof v === 'string' ? v : "");
  }, [table.getColumn("name")?.getFilterValue()]);
  useEffect(() => {
    const v = table.getColumn("email")?.getFilterValue();
    setEmailSearch(typeof v === 'string' ? v : "");
  }, [table.getColumn("email")?.getFilterValue()]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // 数据加载与API对接
  useEffect(() => {
    userApi.getUsers()
      .then(setData)
      .catch(() => toast.error('获取管理员数据失败'))
  }, [])

  // 添加管理员对话框组件
  function AddAdminDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<AddAdminFormData>({
      resolver: zodResolver(addAdminSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        createdAt: new Date().toISOString().slice(0, 16),
      },
    })
    React.useEffect(() => {
      if (open) {
        form.reset({
          name: "",
          email: "",
          password: "",
          createdAt: new Date().toISOString().slice(0, 16),
        })
      }
    }, [open, form])
    async function onSubmit(data: AddAdminFormData) {
      try {
        setIsLoading(true)
        const existingIds = dataRef.current.map(item => item.id)
        const id = generateUniqueId(existingIds)
        const submitData = {
          ...data,
          id,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        };
        await userApi.createUser(submitData)
        userApi.getUsers().then(setData)
        onOpenChange(false)
        toast.success('添加成功')
      } catch (error) {
        toast.error("添加管理员失败")
      } finally {
        setIsLoading(false)
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加管理员</DialogTitle>
            <DialogDescription>
              请填写管理员信息，ID自动生成。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  姓名
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="col-span-3"
                  placeholder="请输入管理员姓名（选填）"
                />
                {form.formState.errors.name && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="col-span-3"
                  placeholder="请输入管理员邮箱（选填）"
                />
                {form.formState.errors.email && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="col-span-3"
                  placeholder="请输入密码（选填）"
                />
                {form.formState.errors.password && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdAt" className="text-right">
                  创建时间
                </Label>
                <Input
                  id="createdAt"
                  type="datetime-local"
                  {...form.register("createdAt")}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "添加中..." : "添加"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // 修改管理员对话框组件
  function EditAdminDialog({ open, onOpenChange, admin }: { open: boolean; onOpenChange: (open: boolean) => void; admin: Admin }) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<EditAdminFormData>({
      resolver: zodResolver(editAdminSchema),
      defaultValues: {
        id: admin.id,
        name: admin.name || "",
        email: admin.email || "",
        password: admin.password || "",
        createdAt: admin.createdAt ? new Date(admin.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      },
    })
    React.useEffect(() => {
      if (open) {
        form.reset({
          id: admin.id,
          name: admin.name || "",
          email: admin.email || "",
          password: admin.password || "",
          createdAt: admin.createdAt ? new Date(admin.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        })
      }
    }, [open, admin, form])
    async function onSubmit(data: EditAdminFormData) {
      try {
        setIsLoading(true)
        const submitData = {
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        };
        await userApi.updateUser(submitData)
        userApi.getUsers().then(setData)
        onOpenChange(false)
        toast.success('修改成功')
      } catch (error) {
        toast.error("修改管理员失败")
      } finally {
        setIsLoading(false)
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>修改管理员</DialogTitle>
            <DialogDescription>
              修改管理员信息
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  {...form.register("id")}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  姓名
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="col-span-3"
                />
                {form.formState.errors.name && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="col-span-3"
                />
                {form.formState.errors.email && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="col-span-3"
                  placeholder="请输入密码（选填）"
                />
                {form.formState.errors.password && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdAt" className="text-right">
                  创建时间
                </Label>
                <Input
                  id="createdAt"
                  type="datetime-local"
                  {...form.register("createdAt")}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "修改中..." : "确认修改"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // 用ref保证获取最新data
  const dataRef = React.useRef<Admin[]>(data)
  React.useEffect(() => { dataRef.current = data }, [data])

  return (
    <Tabs
      defaultValue="outline"
      className="flex w-full flex-col gap-6"
    >
      <div className="flex items-center justify-between px-2 lg:px-4 py-2">
        <div className="flex items-center gap-1 text-sm font-medium">
          管理员列表
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-sm"
              >
                <ListFilter className="h-4 w-4" />
                显示列
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  // 中文列名映射
                  const columnNameMap: Record<string, string> = {
                    select: "选择",
                    id: "ID",
                    name: "姓名",
                    email: "邮箱",
                    password: "密码",
                    createdAt: "创建时间",
                    actions: "操作",
                  };
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnNameMap[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
            添加管理员
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-7 gap-1 px-2 text-sm"
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            onClick={() => {
              setDeleteBatch(true)
              setDeleteDialogOpen(true)
            }}
          >
            <TrashIcon className="h-4 w-4" />
            删除
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          <Table className="text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-8">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="py-1 px-2 text-xs">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-8">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1 px-2 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-16 text-center text-sm"
                  >
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* 固定底部的分页和行选中信息 */}
        <div className="flex items-center justify-end space-x-2 py-2 mt-2 border-t bg-white sticky bottom-0 z-10">
          <div className="flex-1 text-xs text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} 行被选中
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xs">每页</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={value => setPagination(p => ({ ...p, pageSize: Number(value), pageIndex: 0 }))}
              >
                <SelectTrigger className="w-16 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs">条</span>
            </div>
            {/* 页码跳转 */}
            <div className="flex items-center gap-1">
              <span className="text-xs">跳转到</span>
              <Input
                type="number"
                min={1}
                max={table.getPageCount()}
                value={pageInput}
                onChange={e => setPageInput(Number(e.target.value))}
                onBlur={() => {
                  let page = Number(pageInput) - 1
                  if (isNaN(page) || page < 0) page = 0
                  if (page >= table.getPageCount()) page = table.getPageCount() - 1
                  setPagination(p => ({ ...p, pageIndex: page }))
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    let page = Number(pageInput) - 1
                    if (isNaN(page) || page < 0) page = 0
                    if (page >= table.getPageCount()) page = table.getPageCount() - 1
                    setPagination(p => ({ ...p, pageIndex: page }))
                  }
                }}
                className="w-14 h-7 text-xs px-1"
                style={{ minWidth: 0 }}
              />
              <span className="text-xs">页</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              下一页
            </Button>
          </div>
        </div>
      </div>
      <AddAdminDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      {editingAdmin && (
        <EditAdminDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          admin={editingAdmin}
        />
      )}
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              {deleteBatch
                ? `确定要删除选中的所有管理员吗？`
                : `确定要删除该管理员吗？`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteBatch) {
                  const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id)
                  await Promise.all(selectedIds.map(id => userApi.deleteUser(id)))
                  userApi.getUsers().then(setData)
                  toast.success('批量删除成功')
                } else if (deleteTargetId) {
                  await userApi.deleteUser(deleteTargetId)
                  userApi.getUsers().then(setData)
                  toast.success('删除成功')
                }
                setDeleteDialogOpen(false)
              }}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig
