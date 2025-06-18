import type { UserBase } from "@/types/user";

// 获取所有用户
export async function getUsers(userType: string): Promise<UserBase[]> {
  const res = await fetch(`/api/${userType}`);
  if (!res.ok) throw new Error("获取用户失败");
  return res.json();
}

// 新建用户
export async function createUser(userType: string, data: Partial<UserBase>): Promise<UserBase> {
  const res = await fetch(`/api/${userType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("新建用户失败");
  return res.json();
}

// 更新用户
export async function updateUser(userType: string, data: Partial<UserBase>): Promise<UserBase> {
  const res = await fetch(`/api/${userType}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("更新用户失败");
  return res.json();
}

// 删除用户
export async function deleteUser(userType: string, id: string): Promise<void> {
  const res = await fetch(`/api/${userType}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("删除用户失败");
} 