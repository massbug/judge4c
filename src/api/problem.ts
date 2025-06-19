import type { Problem } from "@/types/problem";

// 获取所有题目
export async function getProblems(): Promise<Problem[]> {
  const res = await fetch("/api/problem");
  if (!res.ok) throw new Error("获取题目失败");
  return res.json();
}

// 新建题目
export async function createProblem(data: Partial<Problem>): Promise<Problem> {
  const res = await fetch("/api/problem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("新建题目失败");
  return res.json();
}

// 编辑题目
export async function updateProblem(data: Partial<Problem>): Promise<Problem> {
  const res = await fetch("/api/problem", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("更新题目失败");
  return res.json();
}

// 删除题目
export async function deleteProblem(id: string): Promise<void> {
  const res = await fetch("/api/problem", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("删除题目失败");
} 