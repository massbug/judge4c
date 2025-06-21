import { z } from "zod";

// 基础用户 schema
export const baseUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

// 基础添加用户 schema
export const baseAddUserSchema = z.object({
  name: z.string().min(1, "姓名为必填项"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码长度8-32位").max(32, "密码长度8-32位"),
  createdAt: z.string(),
});

// 基础编辑用户 schema
export const baseEditUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "姓名为必填项"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码长度8-32位").max(32, "密码长度8-32位"),
  createdAt: z.string(),
});

// 基础表格列配置
export const baseColumns = [
  { key: "id", label: "ID", sortable: true },
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
  { key: "createdAt", label: "创建时间", sortable: true },
];

// 基础表单字段配置
export const baseFormFields = [
  {
    key: "name",
    label: "姓名",
    type: "text",
    placeholder: "请输入姓名",
    required: true,
  },
  {
    key: "email",
    label: "邮箱",
    type: "email",
    placeholder: "请输入邮箱",
    required: true,
  },
  {
    key: "password",
    label: "密码",
    type: "password",
    placeholder: "请输入8-32位密码",
    required: true,
  },
  {
    key: "createdAt",
    label: "创建时间",
    type: "datetime-local",
    required: false,
  },
];

// 基础操作配置
export const baseActions = {
  add: { label: "添加", icon: "PlusIcon" },
  edit: { label: "编辑", icon: "PencilIcon" },
  delete: { label: "删除", icon: "TrashIcon" },
  batchDelete: { label: "批量删除", icon: "TrashIcon" },
};

// 基础分页配置
export const basePagination = {
  pageSizes: [10, 50, 100, 500],
  defaultPageSize: 10,
};

// 创建用户配置的工厂函数
export function createUserConfig(
  userType: string,
  title: string,
  addLabel: string,
  namePlaceholder: string,
  emailPlaceholder: string
) {
  return {
    userType,
    title,
    apiPath: "/api/user",
    columns: baseColumns,
    formFields: baseFormFields.map((field) => ({
      ...field,
      placeholder:
        field.key === "name"
          ? namePlaceholder
          : field.key === "email"
          ? emailPlaceholder
          : field.placeholder,
    })),
    actions: {
      ...baseActions,
      add: { ...baseActions.add, label: addLabel },
    },
    pagination: basePagination,
  };
}
