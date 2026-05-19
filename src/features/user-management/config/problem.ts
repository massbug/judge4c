import { z } from "zod";

export const problemSchema = z.object({
  id: z.string(),
  displayId: z.number(),
  title: z.string().optional(),
  difficulty: z.string(),
  createdAt: z.string(),
});

export const addProblemSchema = z.object({
  displayId: z.number(),
  difficulty: z.string(),
});

export const editProblemSchema = z.object({
  id: z.string(),
  displayId: z.number(),
  difficulty: z.string(),
});

export const problemConfig = {
  resourceType: "problem",
  title: "题目列表",
  apiPath: "/api/problem",
  columns: [
    {
      key: "displayId",
      label: "题目编号",
      sortable: true,
      searchable: true,
      placeholder: "搜索编号",
    },
    {
      key: "title",
      label: "题目标题",
      sortable: true,
      searchable: true,
      placeholder: "搜索标题",
    },
    {
      key: "difficulty",
      label: "难度",
      sortable: true,
      searchable: true,
      placeholder: "搜索难度",
    },
  ],
  formFields: [
    { key: "displayId", label: "题目编号", type: "number", required: true },
    { key: "difficulty", label: "难度", type: "text", required: true },
  ],
  actions: {
    add: { label: "添加题目", icon: "PlusIcon" },
    edit: { label: "编辑", icon: "PencilIcon" },
    delete: { label: "删除", icon: "TrashIcon" },
    batchDelete: { label: "批量删除", icon: "TrashIcon" },
  },
  pagination: { pageSizes: [10, 50, 100, 500], defaultPageSize: 10 },
};
