import { z } from "zod"
import { createUserConfig, baseUserSchema, baseAddUserSchema, baseEditUserSchema } from './base-config'

// 管理员数据校验 schema
export const adminSchema = baseUserSchema
export type Admin = z.infer<typeof adminSchema>

// 添加管理员表单校验 schema
export const addAdminSchema = baseAddUserSchema
export type AddAdminFormData = z.infer<typeof addAdminSchema>

// 编辑管理员表单校验 schema
export const editAdminSchema = baseEditUserSchema
export type EditAdminFormData = z.infer<typeof editAdminSchema>

// 管理员配置
export const adminConfig = createUserConfig(
  "admin",
  "管理员列表",
  "添加管理员",
  "请输入管理员姓名",
  "请输入管理员邮箱"
) 