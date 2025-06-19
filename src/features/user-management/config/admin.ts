import { z } from "zod"

// 管理员数据校验 schema
export const adminSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export type Admin = z.infer<typeof adminSchema>

// 添加管理员表单校验 schema
export const addAdminSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  createdAt: z.string(),
})

// 编辑管理员表单校验 schema
export const editAdminSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  createdAt: z.string(),
})

export type AddAdminFormData = z.infer<typeof addAdminSchema>
export type EditAdminFormData = z.infer<typeof editAdminSchema>

// 管理员配置
export const adminConfig = {
  userType: "admin",
  title: "管理员列表",
  apiPath: "/api/user",
  
  // 表格列配置
  columns: [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "姓名",
      sortable: true,
      searchable: true,
      placeholder: "搜索姓名",
    },
    {
      key: "email",
      label: "邮箱",
      sortable: true,
      searchable: true,
      placeholder: "搜索邮箱",
    },
    {
      key: "password",
      label: "密码",
    },
    {
      key: "createdAt",
      label: "创建时间",
      sortable: true,
    },
  ],
  
  // 表单字段配置
  formFields: [
    {
      key: "name",
      label: "姓名",
      type: "text",
      placeholder: "请输入管理员姓名（选填）",
      required: false,
    },
    {
      key: "email",
      label: "邮箱",
      type: "email",
      placeholder: "请输入管理员邮箱",
      required: true,
    },
    {
      key: "password",
      label: "密码",
      type: "password",
      placeholder: "请输入密码（选填）",
      required: false,
    },
    {
      key: "createdAt",
      label: "创建时间",
      type: "datetime-local",
      required: true,
    },
  ],
  
  // 操作按钮配置
  actions: {
    add: {
      label: "添加管理员",
      icon: "PlusIcon",
    },
    edit: {
      label: "编辑",
      icon: "PencilIcon",
    },
    delete: {
      label: "删除",
      icon: "TrashIcon",
    },
    batchDelete: {
      label: "批量删除",
      icon: "TrashIcon",
    },
  },
  
  // 分页配置
  pagination: {
    pageSizes: [10, 50, 100, 500],
    defaultPageSize: 10,
  },
} 