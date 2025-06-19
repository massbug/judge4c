import { z } from "zod";

export const studentSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const addStudentSchema = z.object({
  name: z.string().min(1, "姓名为必填项"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码长度8-32位").max(32, "密码长度8-32位"),
  createdAt: z.string(),
});

export const editStudentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "姓名为必填项"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码长度8-32位").max(32, "密码长度8-32位"),
  createdAt: z.string(),
});

export const studentConfig = {
  userType: "student",
  title: "学生列表",
  apiPath: "/api/user",
  columns: [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "姓名", sortable: true, searchable: true, placeholder: "搜索姓名" },
    { key: "email", label: "邮箱", sortable: true, searchable: true, placeholder: "搜索邮箱" },
    { key: "password", label: "密码" },
    { key: "createdAt", label: "创建时间", sortable: true },
  ],
  formFields: [
    { key: "name", label: "姓名", type: "text", placeholder: "请输入学生姓名", required: true },
    { key: "email", label: "邮箱", type: "email", placeholder: "请输入学生邮箱", required: true },
    { key: "password", label: "密码", type: "password", placeholder: "请输入8-32位密码", required: true },
    { key: "createdAt", label: "创建时间", type: "datetime-local", required: true },
  ],
  actions: {
    add: { label: "添加学生", icon: "PlusIcon" },
    edit: { label: "编辑", icon: "PencilIcon" },
    delete: { label: "删除", icon: "TrashIcon" },
    batchDelete: { label: "批量删除", icon: "TrashIcon" },
  },
  pagination: { pageSizes: [10, 50, 100, 500], defaultPageSize: 10 },
}; 