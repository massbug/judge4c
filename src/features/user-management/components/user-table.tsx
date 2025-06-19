"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
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
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ListFilter,
} from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
} from "@/components/ui/tabs"

import * as userApi from "@/api/user"
import * as problemApi from "@/api/problem"

// 通用用户类型
export interface UserConfig {
  userType: string
  title: string
  apiPath: string
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    searchable?: boolean
    placeholder?: string
  }>
  formFields: Array<{
    key: string
    label: string
    type: string
    placeholder?: string
    required?: boolean
  }>
  actions: {
    add: { label: string; icon: string }
    edit: { label: string; icon: string }
    delete: { label: string; icon: string }
    batchDelete: { label: string; icon: string }
  }
  pagination: {
    pageSizes: number[]
    defaultPageSize: number
  }
}

interface UserTableProps {
  config: UserConfig
  data: any[]
}

// 在组件内部定义 schema
const addUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  createdAt: z.string(),
})

const editUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  createdAt: z.string(),
})

const addProblemSchema = z.object({
  displayId: z.number(),
  difficulty: z.string(),
})

const editProblemSchema = z.object({
  id: z.string(),
  displayId: z.number(),
  difficulty: z.string(),
})

export function UserTable({ config, data: initialData }: UserTableProps) {
  const [data, setData] = useState<any[]>(initialData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: config.pagination.defaultPageSize,
  })

  // 删除确认对话框相关state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteBatch, setDeleteBatch] = useState(false)

  // 页码输入本地state
  const [pageInput, setPageInput] = useState(pagination.pageIndex + 1)
  useEffect(() => {
    setPageInput(pagination.pageIndex + 1)
  }, [pagination.pageIndex])

  // 判断是否为题目管理
  const isProblem = config.userType === "problem"

  // 动态生成表格列
  const tableColumns = React.useMemo<ColumnDef<any>[]>(() => {
    const columns: ColumnDef<any>[] = [
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
    ]

    // 添加配置的列
    config.columns.forEach((col) => {
      const column: ColumnDef<any> = {
        accessorKey: col.key,
        header: ({ column: tableColumn }) => {
          if (col.searchable) {
            return (
              <div className="flex items-center gap-1">
                <span>{col.label}</span>
                <Input
                  placeholder={col.placeholder || "搜索"}
                  className="h-6 w-24 text-xs px-1"
                  value={(() => {
                    const v = tableColumn.getFilterValue()
                    return typeof v === 'string' ? v : ''
                  })()}
                  onChange={e => tableColumn.setFilterValue(e.target.value)}
                  style={{ minWidth: 0 }}
                />
              </div>
            )
          }
          return col.label
        },
        cell: ({ row }) => {
          const value = row.getValue(col.key)
          return value
        },
        enableSorting: col.sortable !== false,
        filterFn: col.searchable ? (row, columnId, value) => {
          const searchValue = String(value).toLowerCase()
          const cellValue = String(row.getValue(columnId)).toLowerCase()
          return cellValue.includes(searchValue)
        } : undefined,
      }
      columns.push(column)
    })

    // 添加操作列
    columns.push({
      id: "actions",
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                setEditingUser(user)
                setIsEditDialogOpen(true)
              }}
            >
              <PencilIcon className="size-4 mr-1" /> {config.actions.edit.label}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1 text-destructive hover:text-destructive" 
              onClick={() => {
                setDeleteTargetId(user.id)
                setDeleteBatch(false)
                setDeleteDialogOpen(true)
              }}
              aria-label="Delete"
            >
              <TrashIcon className="size-4 mr-1" /> {config.actions.delete.label}
            </Button>
          </div>
        )
      },
    })

    return columns
  }, [config])

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
  })

  // 数据加载与API对接
  useEffect(() => {
    if (isProblem) {
      problemApi.getProblems()
        .then(setData)
        .catch(() => toast.error('获取数据失败', { duration: 1500 }))
    } else {
    userApi.getUsers(config.userType)
      .then(setData)
        .catch(() => toast.error('获取数据失败', { duration: 1500 }))
    }
  }, [config.userType])

  // 生成唯一ID
  function generateUniqueId(existingIds: string[]): string {
    let id: string
    do {
      id = Math.random().toString(36).substr(2, 9)
    } while (existingIds.includes(id))
    return id
  }

  // 添加用户对话框组件（仅用户）
  function AddUserDialogUser({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
      resolver: zodResolver(addUserSchema),
      defaultValues: { name: "", email: "", password: "", createdAt: new Date().toISOString().slice(0, 16) },
    })
    React.useEffect(() => {
      if (open) {
        form.reset({ name: "", email: "", password: "", createdAt: new Date().toISOString().slice(0, 16) })
      }
    }, [open, form])
    async function onSubmit(formData: any) {
      try {
        setIsLoading(true)
        const existingIds = dataRef.current.map(item => item.id)
        const id = generateUniqueId(existingIds)
        const submitData = {
          ...formData,
          id,
          createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : new Date().toISOString(),
        }
        await userApi.createUser(config.userType, submitData)
        userApi.getUsers(config.userType).then(setData)
        onOpenChange(false)
        toast.success('添加成功', { duration: 1500 })
      } catch {
        toast.error('添加失败', { duration: 1500 })
      } finally {
        setIsLoading(false)
      }
    }
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{config.actions.add.label}</DialogTitle>
            <DialogDescription>
              请填写信息，ID自动生成。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {config.formFields.map((field) => (
                <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field.key} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    {...form.register(field.key as 'name' | 'email' | 'password' | 'createdAt')}
                    className="col-span-3"
                    placeholder={field.placeholder}
                  />
                  {form.formState.errors[field.key as keyof typeof form.formState.errors]?.message && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                      {form.formState.errors[field.key as keyof typeof form.formState.errors]?.message as string}
                    </p>
                  )}
                </div>
              ))}
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

  // 添加题目对话框组件（仅题目）
  function AddUserDialogProblem({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
      resolver: zodResolver(addProblemSchema),
      defaultValues: { displayId: 0, difficulty: "" },
    })
    React.useEffect(() => {
      if (open) {
        form.reset({ displayId: 0, difficulty: "" })
      }
    }, [open, form])
    async function onSubmit(formData: any) {
      try {
        setIsLoading(true)
        const existingIds = dataRef.current.map(item => item.id)
        const id = generateUniqueId(existingIds)
        const submitData = {
          ...formData,
          displayId: Number(formData.displayId),
          id,
        }
        await problemApi.createProblem(submitData)
        problemApi.getProblems().then(setData)
        onOpenChange(false)
        toast.success('添加成功', { duration: 1500 })
      } catch {
        toast.error('添加失败', { duration: 1500 })
      } finally {
        setIsLoading(false)
      }
    }
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{config.actions.add.label}</DialogTitle>
            <DialogDescription>
              请填写信息，ID自动生成。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {config.formFields.map((field) => (
                <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field.key} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    {...form.register(field.key as 'displayId' | 'difficulty', field.key === 'displayId' ? { valueAsNumber: true } : {})}
                    className="col-span-3"
                    placeholder={field.placeholder}
                  />
                  {form.formState.errors[field.key as keyof typeof form.formState.errors]?.message && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                      {form.formState.errors[field.key as keyof typeof form.formState.errors]?.message as string}
                    </p>
                  )}
                </div>
              ))}
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

  // 编辑用户对话框组件（仅用户）
  function EditUserDialogUser({ open, onOpenChange, user }: { open: boolean; onOpenChange: (open: boolean) => void; user: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
      resolver: zodResolver(editUserSchema),
      defaultValues: { id: user.id, name: user.name || "", email: user.email || "", password: "", createdAt: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16) },
    })
    React.useEffect(() => {
      if (open) {
        form.reset({ id: user.id, name: user.name || "", email: user.email || "", password: "", createdAt: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16) })
      }
    }, [open, user, form])
    async function onSubmit(formData: any) {
      try {
        setIsLoading(true)
        const submitData = {
          ...formData,
          createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : new Date().toISOString(),
        }
        if (!submitData.password) {
          delete submitData.password;
        }
        await userApi.updateUser(config.userType, submitData)
        userApi.getUsers(config.userType).then(setData)
        onOpenChange(false)
        toast.success('修改成功', { duration: 1500 })
      } catch {
        toast.error('修改失败', { duration: 1500 })
      } finally {
        setIsLoading(false)
      }
    }
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{config.actions.edit.label}</DialogTitle>
            <DialogDescription>
              修改信息
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {config.formFields.map((field) => (
                <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field.key} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    {...form.register(field.key as 'name' | 'email' | 'password' | 'createdAt' | 'id')}
                    className="col-span-3"
                    placeholder={field.placeholder}
                    disabled={field.key === 'id'}
                  />
                  {form.formState.errors[field.key as keyof typeof form.formState.errors]?.message && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                      {form.formState.errors[field.key as keyof typeof form.formState.errors]?.message as string}
                    </p>
                  )}
                </div>
              ))}
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

  // 编辑题目对话框组件（仅题目）
  function EditUserDialogProblem({ open, onOpenChange, user }: { open: boolean; onOpenChange: (open: boolean) => void; user: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
      resolver: zodResolver(editProblemSchema),
      defaultValues: { id: user.id, displayId: Number(user.displayId), difficulty: user.difficulty || "" },
    })
    React.useEffect(() => {
      if (open) {
        form.reset({ id: user.id, displayId: Number(user.displayId), difficulty: user.difficulty || "" })
      }
    }, [open, user, form])
    async function onSubmit(formData: any) {
      try {
        setIsLoading(true)
        const submitData = {
          ...formData,
          displayId: Number(formData.displayId),
        }
        await problemApi.updateProblem(submitData)
        problemApi.getProblems().then(setData)
        onOpenChange(false)
        toast.success('修改成功', { duration: 1500 })
      } catch {
        toast.error('修改失败', { duration: 1500 })
      } finally {
        setIsLoading(false)
      }
    }
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{config.actions.edit.label}</DialogTitle>
            <DialogDescription>
              修改信息
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayId" className="text-right">题目编号</Label>
                <Input
                  id="displayId"
                  type="number"
                  {...form.register('displayId', { valueAsNumber: true })}
                  className="col-span-3"
                  placeholder="请输入题目编号"
                />
                {form.formState.errors.displayId?.message && (
                  <p className="col-span-3 col-start-2 text-sm text-red-500">
                    {form.formState.errors.displayId?.message as string}
                  </p>
                )}
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
  const dataRef = React.useRef<any[]>(data)
  React.useEffect(() => { dataRef.current = data }, [data])

  return (
    <Tabs defaultValue="outline" className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between px-2 lg:px-4 py-2">
        <div className="flex items-center gap-1 text-sm font-medium">
          {config.title}
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
                  const columnNameMap: Record<string, string> = {
                    select: "选择",
                    id: "ID",
                    name: "姓名",
                    email: "邮箱",
                    password: "密码",
                    createdAt: "创建时间",
                    actions: "操作",
                    displayId: "题目编号",
                    difficulty: "难度",
                  }
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
          {config.actions.add && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
              {config.actions.add.label}
            </Button>
          )}
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
            {config.actions.batchDelete.label}
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-8"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-1 px-2 text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </div>
        
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          共 {table.getFilteredRowModel().rows.length} 条记录
          </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">每页显示</p>
              <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
              <SelectContent side="top">
                {config.pagination.pageSizes.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            第 {table.getState().pagination.pageIndex + 1} 页，共{" "}
            {table.getPageCount()} 页
            </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">跳转到</span>
              <Input
                type="number"
                min={1}
                max={table.getPageCount()}
                value={pageInput}
                onChange={(e) => setPageInput(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = pageInput - 1
                    if (page >= 0 && page < table.getPageCount()) {
                      table.setPageIndex(page)
                    }
                  }
                }}
                className="w-16 h-8 text-sm"
              />
              <span className="text-sm">页</span>
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* 添加用户对话框 */}
      {isProblem && config.actions.add ? (
        <AddUserDialogProblem open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      ) : !isProblem && config.actions.add ? (
        <AddUserDialogUser open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      ) : null}
      
      {/* 编辑用户对话框 */}
      {isProblem && editingUser ? (
        <EditUserDialogProblem open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} user={editingUser} />
      ) : editingUser ? (
        <EditUserDialogUser open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} user={editingUser} />
      ) : null}
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              {deleteBatch
                ? `确定要删除选中的 ${table.getFilteredSelectedRowModel().rows.length} 条记录吗？此操作不可撤销。`
                : "确定要删除这条记录吗？此操作不可撤销。"
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                if (deleteBatch) {
                    const selectedRows = table.getFilteredSelectedRowModel().rows
                    for (const row of selectedRows) {
                      if (isProblem) {
                        await problemApi.deleteProblem(row.original.id)
                        problemApi.getProblems().then(setData)
                      } else {
                        await userApi.deleteUser(config.userType, row.original.id)
                  userApi.getUsers(config.userType).then(setData)
                      }
                    }
                    toast.success(`成功删除 ${selectedRows.length} 条记录`, { duration: 1500 })
                } else if (deleteTargetId) {
                    if (isProblem) {
                      await problemApi.deleteProblem(deleteTargetId)
                      problemApi.getProblems().then(setData)
                    } else {
                  await userApi.deleteUser(config.userType, deleteTargetId)
                  userApi.getUsers(config.userType).then(setData)
                    }
                    toast.success('删除成功', { duration: 1500 })
                  }
                  setDeleteDialogOpen(false)
                } catch {
                  toast.error('删除失败', { duration: 1500 })
                }
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