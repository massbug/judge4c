import { z } from "zod";

export const teacherSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const addTeacherSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  createdAt: z.string(),
});

export const editTeacherSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  createdAt: z.string(),
});

export const teacherConfig = {
  userType: "teacher",
  title: "教师列表",
  apiPath: "/api/user",
  columns: [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "姓名", sortable: true, searchable: true, placeholder: "搜索姓名" },
    { key: "email", label: "邮箱", sortable: true, searchable: true, placeholder: "搜索邮箱" },
    { key: "password", label: "密码" },
    { key: "createdAt", label: "创建时间", sortable: true },
  ],
  formFields: [
    { key: "name", label: "姓名", type: "text", placeholder: "请输入教师姓名（选填）", required: false },
    { key: "email", label: "邮箱", type: "email", placeholder: "请输入教师邮箱", required: true },
    { key: "password", label: "密码", type: "password", placeholder: "请输入密码（选填）", required: false },
    { key: "createdAt", label: "创建时间", type: "datetime-local", required: true },
  ],
  actions: {
    add: { label: "添加教师", icon: "PlusIcon" },
    edit: { label: "编辑", icon: "PencilIcon" },
    delete: { label: "删除", icon: "TrashIcon" },
    batchDelete: { label: "批量删除", icon: "TrashIcon" },
  },
  pagination: { pageSizes: [10, 50, 100, 500], defaultPageSize: 10 },
}; 