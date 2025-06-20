import { z } from "zod";

export const guestSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const addGuestSchema = z.object({
  name: z.string().min(1, "姓名为必填项"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码长度8-32位").max(32, "密码长度8-32位"),
  createdAt: z.string(),
});

export const editGuestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "姓名为必填项"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码长度8-32位").max(32, "密码长度8-32位"),
  createdAt: z.string(),
});

export const guestConfig = {
  userType: "guest",
  title: "客户列表",
  apiPath: "/api/user",
  columns: [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "姓名", sortable: true, searchable: true, placeholder: "搜索姓名" },
    { key: "email", label: "邮箱", sortable: true, searchable: true, placeholder: "搜索邮箱" },
    { key: "createdAt", label: "创建时间", sortable: true },
  ],
  formFields: [
    { key: "name", label: "姓名", type: "text", placeholder: "请输入客户姓名", required: true },
    { key: "email", label: "邮箱", type: "email", placeholder: "请输入客户邮箱", required: true },
    { key: "password", label: "密码", type: "password", placeholder: "请输入8-32位密码", required: true },
    { key: "createdAt", label: "创建时间", type: "datetime-local", required: false },
  ],
  actions: {
    add: { label: "添加客户", icon: "PlusIcon" },
    edit: { label: "编辑", icon: "PencilIcon" },
    delete: { label: "删除", icon: "TrashIcon" },
    batchDelete: { label: "批量删除", icon: "TrashIcon" },
  },
  pagination: { pageSizes: [10, 50, 100, 500], defaultPageSize: 10 },
}; 