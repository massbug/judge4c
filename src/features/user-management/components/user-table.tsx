"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ListFilter,
} from "lucide-react";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
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
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Tabs } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Difficulty, Role } from "@/generated/client";
import type { User, Problem } from "@/generated/client";
import {
  createUser,
  updateUser,
  deleteUser,
} from "@/app/(protected)/dashboard/usermanagement/actions/userActions";
import {
  createProblem,
  deleteProblem,
} from "@/app/(protected)/dashboard/usermanagement/actions/problemActions";

export interface UserConfig {
  userType: string;
  title: string;
  apiPath: string;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    searchable?: boolean;
    placeholder?: string;
  }>;
  formFields: Array<{
    key: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  actions: {
    add: { label: string; icon: string };
    edit: { label: string; icon: string };
    delete: { label: string; icon: string };
    batchDelete: { label: string; icon: string };
  };
  pagination: {
    pageSizes: number[];
    defaultPageSize: number;
  };
}

type UserTableProps =
  | { config: UserConfig; data: User[] }
  | { config: UserConfig; data: Problem[] };

type UserForm = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  role: Role;
  image: string | null;
  emailVerified: Date | null;
};

// 新增用户表单类型
type AddUserForm = Omit<UserForm, "id">;

const addUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(1, "密码不能为空").min(8, "密码长度至少8位"),
  createdAt: z.string(),
  image: z.string().nullable(),
  emailVerified: z.date().nullable(),
  role: z.nativeEnum(Role),
});

const editUserSchema = z.object({
  id: z.string().default(""),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.string(),
  image: z.string().nullable(),
  emailVerified: z.date().nullable(),
  role: z.nativeEnum(Role),
});

// 题目表单 schema 兼容 null/undefined
const addProblemSchema = z.object({
  displayId: z.number().optional().default(0),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.EASY),
});

export function UserTable(props: UserTableProps) {
  const isProblem = props.config.userType === "problem";
  const router = useRouter();
  const problemData = isProblem ? (props.data as Problem[]) : undefined;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | Problem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBatch, setDeleteBatch] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: props.config.pagination.defaultPageSize,
  });
  const [pageInput, setPageInput] = useState(pagination.pageIndex + 1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<
    User | Problem | null
  >(null);
  useEffect(() => {
    setPageInput(pagination.pageIndex + 1);
  }, [pagination.pageIndex]);

  // 表格列
  const tableColumns = React.useMemo<ColumnDef<User | Problem>[]>(() => {
    const columns: ColumnDef<User | Problem>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
    ];
    props.config.columns.forEach((col) => {
      const column: ColumnDef<User | Problem> = {
        accessorKey: col.key,
        header: col.label,
        cell: ({ row }) => {
          // 类型安全分流
          if (col.key === "displayId" && isProblem) {
            return (row.original as Problem).displayId;
          }
          if (col.key === "createdAt" || col.key === "updatedAt") {
            const value = row.getValue(col.key);
            if (value instanceof Date) {
              return value.toLocaleString();
            }
            if (typeof value === "string" && !isNaN(Date.parse(value))) {
              return new Date(value).toLocaleString();
            }
          }
          return row.getValue(col.key);
        },
        enableSorting: col.sortable !== false,
        filterFn: col.searchable
          ? (row, columnId, value) => {
              const searchValue = String(value).toLowerCase();
              const cellValue = String(row.getValue(columnId)).toLowerCase();
              return cellValue.includes(searchValue);
            }
          : undefined,
      };
      columns.push(column);
    });
    columns.push({
      id: "actions",
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                if (isProblem) {
                  // 如果是problem类型，跳转到编辑路由，使用displayId
                  const problem = item as Problem;
                  router.push(`/admin/problems/${problem.displayId}/edit`);
                } else {
                  // 如果是用户类型，打开编辑弹窗
                  setEditingUser(item);
                  setIsEditDialogOpen(true);
                }
              }}
            >
              <PencilIcon className="size-4 mr-1" />{" "}
              {props.config.actions.edit.label}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-destructive hover:text-destructive"
              onClick={() => {
                setPendingDeleteItem(item);
                setDeleteConfirmOpen(true);
              }}
              aria-label="Delete"
            >
              <TrashIcon className="size-4 mr-1" />{" "}
              {props.config.actions.delete.label}
            </Button>
          </div>
        );
      },
    });
    return columns;
  }, [props.config, router, isProblem]);

  const table = useReactTable({
    data: props.data,
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

  // 添加用户对话框组件（仅用户）
  function AddUserDialogUser({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<AddUserForm>({
      resolver: zodResolver(addUserSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        createdAt: "",
        image: null,
        emailVerified: null,
        role: Role.GUEST,
      },
    });
    React.useEffect(() => {
      if (open) {
        form.reset({
          name: "",
          email: "",
          password: "",
          createdAt: "",
          image: null,
          emailVerified: null,
          role: Role.GUEST,
        });
      }
    }, [open, form]);
    async function onSubmit(data: AddUserForm) {
      try {
        setIsLoading(true);

        // 验证必填字段
        if (!data.password || data.password.trim() === "") {
          toast.error("密码不能为空", { duration: 1500 });
          return;
        }

        const submitData = {
          ...data,
          image: data.image ?? null,
          emailVerified: data.emailVerified ?? null,
          role: data.role ?? Role.GUEST,
        };
        if (!submitData.name) submitData.name = "";
        if (!submitData.createdAt)
          submitData.createdAt = new Date().toISOString();
        else
          submitData.createdAt = new Date(submitData.createdAt).toISOString();
        if (props.config.userType === "admin")
          await createUser("admin", submitData);
        else if (props.config.userType === "teacher")
          await createUser("teacher", submitData);
        else if (props.config.userType === "guest")
          await createUser("guest", submitData);
        onOpenChange(false);
        toast.success("添加成功", { duration: 1500 });
        router.refresh();
      } catch (error) {
        console.error("添加失败:", error);
        toast.error("添加失败", { duration: 1500 });
      } finally {
        setIsLoading(false);
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{props.config.actions.add.label}</DialogTitle>
            <DialogDescription>请填写信息，ID自动生成。</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {props.config.formFields
                .filter((field) => field.key !== "id")
                .map((field) => (
                  <div
                    key={field.key}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={field.key} className="text-right">
                      {field.label}
                    </Label>
                    {field.type === "select" && field.options ? (
                      <Select
                        value={
                          form.watch(
                            field.key as
                              | "name"
                              | "email"
                              | "password"
                              | "createdAt"
                              | "role"
                          ) ?? ""
                        }
                        onValueChange={(value) =>
                          form.setValue(
                            field.key as
                              | "name"
                              | "email"
                              | "password"
                              | "createdAt"
                              | "role",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={`请选择${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type}
                        {...form.register(
                          field.key as
                            | "name"
                            | "email"
                            | "password"
                            | "createdAt"
                            | "role"
                        )}
                        className="col-span-3"
                        placeholder={field.placeholder}
                      />
                    )}
                    {form.formState.errors[
                      field.key as keyof typeof form.formState.errors
                    ]?.message && (
                      <p className="col-span-3 col-start-2 text-sm text-red-500">
                        {
                          form.formState.errors[
                            field.key as keyof typeof form.formState.errors
                          ]?.message as string
                        }
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
    );
  }

  // 添加题目对话框组件（仅题目）
  function AddUserDialogProblem({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<Partial<Problem>>({
      resolver: zodResolver(addProblemSchema),
      defaultValues: { displayId: 0, difficulty: Difficulty.EASY },
    });
    React.useEffect(() => {
      if (open) {
        form.reset({ displayId: 0, difficulty: Difficulty.EASY });
      }
    }, [open, form]);
    async function onSubmit(formData: Partial<Problem>) {
      try {
        setIsLoading(true);
        const submitData: Partial<Problem> = {
          ...formData,
          displayId: Number(formData.displayId),
        };
        await createProblem({
          displayId: Number(submitData.displayId),
          difficulty: submitData.difficulty ?? Difficulty.EASY,
          isPublished: false,
          isTrim: false,
          timeLimit: 1000,
          memoryLimit: 134217728,
          userId: null,
        });
        onOpenChange(false);
        toast.success("添加成功", { duration: 1500 });
        router.refresh();
      } catch (error) {
        console.error("添加失败:", error);
        toast.error("添加失败", { duration: 1500 });
      } finally {
        setIsLoading(false);
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{props.config.actions.add.label}</DialogTitle>
            <DialogDescription>请填写信息，ID自动生成。</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {props.config.formFields.map((field) => (
                <div
                  key={field.key}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field.key} className="text-right">
                    {field.label}
                  </Label>
                  {field.key === "difficulty" ? (
                    <Select
                      value={form.watch("difficulty") ?? Difficulty.EASY}
                      onValueChange={(value) =>
                        form.setValue(
                          "difficulty",
                          value as
                            | typeof Difficulty.EASY
                            | typeof Difficulty.MEDIUM
                            | typeof Difficulty.HARD
                        )
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="请选择难度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Difficulty.EASY}>简单</SelectItem>
                        <SelectItem value={Difficulty.MEDIUM}>中等</SelectItem>
                        <SelectItem value={Difficulty.HARD}>困难</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type}
                      {...form.register(
                        field.key as "displayId" | "difficulty" | "id",
                        field.key === "displayId" ? { valueAsNumber: true } : {}
                      )}
                      className="col-span-3"
                      placeholder={field.placeholder}
                    />
                  )}
                  {form.formState.errors[
                    field.key as keyof typeof form.formState.errors
                  ]?.message && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                      {
                        form.formState.errors[
                          field.key as keyof typeof form.formState.errors
                        ]?.message as string
                      }
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
    );
  }

  // 编辑用户对话框组件（仅用户）
  function EditUserDialogUser({
    open,
    onOpenChange,
    user,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
  }) {
    const [isLoading, setIsLoading] = useState(false);
    const editForm = useForm<UserForm>({
      resolver: zodResolver(editUserSchema),
      defaultValues: {
        id: typeof user.id === "string" ? user.id : "",
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        role: user.role ?? Role.GUEST,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString().slice(0, 16)
          : "",
        image: user.image ?? null,
        emailVerified: user.emailVerified ?? null,
      },
    });
    React.useEffect(() => {
      if (open) {
        editForm.reset({
          id: typeof user.id === "string" ? user.id : "",
          name: user.name ?? "",
          email: user.email ?? "",
          password: "",
          role: user.role ?? Role.GUEST,
          createdAt: user.createdAt
            ? new Date(user.createdAt).toISOString().slice(0, 16)
            : "",
          image: user.image ?? null,
          emailVerified: user.emailVerified ?? null,
        });
      }
    }, [open, user, editForm]);
    async function onSubmit(data: UserForm) {
      try {
        setIsLoading(true);
        const submitData = {
          ...data,
          createdAt: data.createdAt
            ? new Date(data.createdAt).toISOString()
            : new Date().toISOString(),
          image: data.image ?? null,
          emailVerified: data.emailVerified ?? null,
          role: data.role ?? Role.GUEST,
        };
        const id = typeof submitData.id === "string" ? submitData.id : "";
        if (props.config.userType === "admin")
          await updateUser("admin", id, submitData);
        else if (props.config.userType === "teacher")
          await updateUser("teacher", id, submitData);
        else if (props.config.userType === "guest")
          await updateUser("guest", id, submitData);
        onOpenChange(false);
        toast.success("修改成功", { duration: 1500 });
      } catch {
        toast.error("修改失败", { duration: 1500 });
      } finally {
        setIsLoading(false);
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{props.config.actions.edit.label}</DialogTitle>
            <DialogDescription>修改信息</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              {props.config.formFields.map((field) => (
                <div
                  key={field.key}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field.key} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    {...editForm.register(
                      field.key as
                        | "name"
                        | "email"
                        | "password"
                        | "createdAt"
                        | "role"
                    )}
                    className="col-span-3"
                    placeholder={field.placeholder}
                    disabled={field.key === "id"}
                  />
                  {editForm.formState.errors[
                    field.key as keyof typeof editForm.formState.errors
                  ]?.message && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                      {
                        editForm.formState.errors[
                          field.key as keyof typeof editForm.formState.errors
                        ]?.message as string
                      }
                    </p>
                  )}
                </div>
              ))}
              {/* 编辑时显示角色选择 */}
              {props.config.userType !== "problem" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    角色
                  </Label>
                  <Select
                    value={editForm.watch("role") ?? ""}
                    onValueChange={(value) =>
                      editForm.setValue("role", value as Role)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="请选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.config.userType === "guest" && (
                        <>
                          <SelectItem value="GUEST">学生</SelectItem>
                          <SelectItem value="TEACHER">老师</SelectItem>
                        </>
                      )}
                      {(props.config.userType === "teacher" ||
                        props.config.userType === "admin") && (
                        <>
                          <SelectItem value="ADMIN">管理员</SelectItem>
                          <SelectItem value="TEACHER">老师</SelectItem>
                          <SelectItem value="GUEST">学生</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {editForm.formState.errors.role?.message && (
                    <p className="col-span-3 col-start-2 text-sm text-red-500">
                      {editForm.formState.errors.role?.message as string}
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "修改中..." : "确认修改"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // 用ref保证获取最新data
  const dataRef = React.useRef<User[] | Problem[]>(props.data);
  React.useEffect(() => {
    dataRef.current = props.data;
  }, [props.data]);

  return (
    <Tabs defaultValue="outline" className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between px-2 lg:px-4 py-2">
        <div className="flex items-center gap-1 text-sm font-medium">
          {props.config.title}
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
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {isProblem && props.config.actions.add && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-sm"
              onClick={async () => {
                const maxDisplayId =
                  Array.isArray(problemData) && problemData.length > 0
                    ? Math.max(
                        ...problemData.map(
                          (item) => Number(item.displayId) || 0
                        ),
                        1000
                      )
                    : 1000;
                await createProblem({
                  displayId: maxDisplayId + 1,
                  difficulty: Difficulty.EASY,
                  isPublished: false,
                  isTrim: false,
                  timeLimit: 1000,
                  memoryLimit: 134217728,
                  userId: null,
                });
                router.refresh();
              }}
            >
              <PlusIcon className="h-4 w-4" />
              {props.config.actions.add.label}
            </Button>
          )}
          {!isProblem && props.config.actions.add && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
              {props.config.actions.add.label}
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="h-7 gap-1 px-2 text-sm"
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            onClick={() => {
              setDeleteBatch(true);
              setDeleteDialogOpen(true);
            }}
          >
            <TrashIcon className="h-4 w-4" />
            {props.config.actions.batchDelete.label}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
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
                    );
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
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {props.config.pagination.pageSizes.map((pageSize) => (
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
                  if (e.key === "Enter") {
                    const page = pageInput - 1;
                    if (page >= 0 && page < table.getPageCount()) {
                      table.setPageIndex(page);
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
      {isProblem && props.config.actions.add ? (
        <AddUserDialogProblem
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      ) : !isProblem && props.config.actions.add ? (
        <AddUserDialogUser
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      ) : null}
      {/* 编辑用户对话框 */}
      {!isProblem && editingUser ? (
        <EditUserDialogUser
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={editingUser as User}
        />
      ) : null}
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              {deleteBatch
                ? `确定要删除选中的 ${
                    table.getFilteredSelectedRowModel().rows.length
                  } 条记录吗？此操作不可撤销。`
                : "确定要删除这条记录吗？此操作不可撤销。"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  if (deleteBatch) {
                    const selectedRows =
                      table.getFilteredSelectedRowModel().rows;
                    for (const row of selectedRows) {
                      if (isProblem) {
                        await deleteProblem((row.original as Problem).id);
                      } else {
                        await deleteUser(
                          props.config.userType as
                            | "admin"
                            | "teacher"
                            | "guest",
                          (row.original as User).id
                        );
                      }
                    }
                    toast.success(`成功删除 ${selectedRows.length} 条记录`, {
                      duration: 1500,
                    });
                  }
                  setDeleteDialogOpen(false);
                  router.refresh();
                } catch {
                  toast.error("删除失败", { duration: 1500 });
                }
              }}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div>确定要删除该条数据吗？此操作不可撤销。</div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (pendingDeleteItem) {
                  if (isProblem) {
                    await deleteProblem((pendingDeleteItem as Problem).id);
                  } else {
                    await deleteUser(
                      props.config.userType as "admin" | "teacher" | "guest",
                      (pendingDeleteItem as User).id
                    );
                  }
                  toast.success("删除成功", { duration: 1500 });
                  router.refresh();
                }
                setDeleteConfirmOpen(false);
                setPendingDeleteItem(null);
              }}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
