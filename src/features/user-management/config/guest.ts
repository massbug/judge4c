import {
  createUserConfig,
  baseUserSchema,
  baseAddUserSchema,
  baseEditUserSchema,
} from "./base-config";
import { z } from "zod";

export const guestSchema = baseUserSchema;
export type Guest = z.infer<typeof guestSchema>;

export const addGuestSchema = baseAddUserSchema;
export type AddGuestFormData = z.infer<typeof addGuestSchema>;

export const editGuestSchema = baseEditUserSchema;
export type EditGuestFormData = z.infer<typeof editGuestSchema>;

export const guestConfig = createUserConfig(
  "guest",
  "客户列表",
  "添加客户",
  "请输入客户姓名",
  "请输入客户邮箱"
);
