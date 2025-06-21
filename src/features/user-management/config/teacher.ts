import {
  createUserConfig,
  baseUserSchema,
  baseAddUserSchema,
  baseEditUserSchema,
} from "./base-config";
import { z } from "zod";

export const teacherSchema = baseUserSchema;
export type Teacher = z.infer<typeof teacherSchema>;

export const addTeacherSchema = baseAddUserSchema;
export type AddTeacherFormData = z.infer<typeof addTeacherSchema>;

export const editTeacherSchema = baseEditUserSchema;
export type EditTeacherFormData = z.infer<typeof editTeacherSchema>;

export const teacherConfig = createUserConfig(
  "teacher",
  "教师列表",
  "添加教师",
  "请输入教师姓名",
  "请输入教师邮箱"
);
