import { z } from "zod";
import { UserTable } from "./index";
import type { Admin } from "@/types/user";

// 管理员表单校验 schema
const adminSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().optional(),
  role: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// 管理员表格列配置
const adminColumns = [
  { key: "id" as keyof Admin, label: "ID" },
  { key: "name" as keyof Admin, label: "姓名" },
  { key: "email" as keyof Admin, label: "邮箱" },
  { key: "role" as keyof Admin, label: "角色" },
  { key: "createdAt" as keyof Admin, label: "创建时间" },
];

// 管理员表单字段配置
const adminFormFields = [
  { key: "name" as keyof Admin, label: "姓名" },
  { key: "email" as keyof Admin, label: "邮箱", type: "email", required: true },
  { key: "password" as keyof Admin, label: "密码", type: "password" },
  { key: "role" as keyof Admin, label: "角色" },
];

export default function AdminTable() {
  return (
    <UserTable<Admin>
      userType="admin"
      columns={adminColumns}
      schema={adminSchema}
      formFields={adminFormFields}
    />
  );
} 