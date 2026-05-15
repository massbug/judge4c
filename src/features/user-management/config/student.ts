import {
  createUserConfig,
  baseUserSchema,
  baseAddUserSchema,
  baseEditUserSchema,
} from "./base-config";
import { z } from "zod";

export const studentSchema = baseUserSchema;
export type Student = z.infer<typeof studentSchema>;

export const addStudentSchema = baseAddUserSchema;
export type AddStudentFormData = z.infer<typeof addStudentSchema>;

export const editStudentSchema = baseEditUserSchema;
export type EditStudentFormData = z.infer<typeof editStudentSchema>;

export const studentConfig = createUserConfig(
  "student",
  "学生列表",
  "添加学生",
  "请输入学生姓名",
  "请输入学生邮箱"
);
