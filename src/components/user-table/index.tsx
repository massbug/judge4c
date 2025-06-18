import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as userApi from "@/api/user";
import type { UserBase } from "@/types/user";

interface UserTableProps<T extends UserBase> {
  userType: string;
  columns: { key: keyof T; label: string; render?: (value: any, row: T) => React.ReactNode }[];
  schema: any; // zod schema
  formFields: { key: keyof T; label: string; type?: string; required?: boolean }[];
}

export function UserTable<T extends UserBase>({ userType, columns, schema, formFields }: UserTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<T | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteBatch, setDeleteBatch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 获取数据
  useEffect(() => {
    userApi.getUsers(userType)
      .then(res => setData(res as T[]))
      .catch(() => toast.error('获取数据失败'))
  }, [userType])

  // 添加用户表单
  function AddUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<any>({
      resolver: zodResolver(schema),
      defaultValues: {},
    });
    React.useEffect(() => {
      if (open) form.reset({});
    }, [open, form]);
    async function onSubmit(values: any) {
      try {
        setIsLoading(true);
        await userApi.createUser(userType, values);
        userApi.getUsers(userType).then(res => setData(res as T[]));
        onOpenChange(false);
        toast.success('添加成功');
      } catch {
        toast.error('添加失败');
      } finally {
        setIsLoading(false);
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {formFields.map(field => (
              <div key={String(field.key)} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={String(field.key)} className="text-right">{field.label}</Label>
                <Input
                  id={String(field.key)}
                  type={field.type || "text"}
                  {...form.register(String(field.key))}
                  className="col-span-3"
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>{isLoading ? "添加中..." : "添加"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // 编辑用户表单
  function EditUserDialog({ open, onOpenChange, user }: { open: boolean; onOpenChange: (open: boolean) => void; user: T }) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<any>({
      resolver: zodResolver(schema),
      defaultValues: user,
    });
    React.useEffect(() => {
      if (open) form.reset(user);
    }, [open, user, form]);
    async function onSubmit(values: any) {
      try {
        setIsLoading(true);
        await userApi.updateUser(userType, { ...user, ...values });
        userApi.getUsers(userType).then(res => setData(res as T[]));
        onOpenChange(false);
        toast.success('修改成功');
      } catch {
        toast.error('修改失败');
      } finally {
        setIsLoading(false);
      }
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {formFields.map(field => (
              <div key={String(field.key)} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={String(field.key)} className="text-right">{field.label}</Label>
                <Input
                  id={String(field.key)}
                  type={field.type || "text"}
                  {...form.register(String(field.key))}
                  className="col-span-3"
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>{isLoading ? "修改中..." : "确认修改"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // 删除确认
  async function handleDelete(ids: string[]) {
    try {
      await Promise.all(ids.map(id => userApi.deleteUser(userType, id)));
      userApi.getUsers(userType).then(res => setData(res as T[]));
      toast.success('删除成功');
    } catch {
      toast.error('删除失败');
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button onClick={() => setIsAddDialogOpen(true)}>添加</Button>
        <Button variant="destructive" disabled={selectedIds.length === 0} onClick={() => { setDeleteBatch(true); setDeleteDialogOpen(true); }}>批量删除</Button>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectedIds.length === data.length && data.length > 0} onChange={e => setSelectedIds(e.target.checked ? data.map(d => d.id) : [])} /></th>
            {columns.map(col => <th key={String(col.key)}>{col.label}</th>)}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td><input type="checkbox" checked={selectedIds.includes(row.id)} onChange={e => setSelectedIds(ids => e.target.checked ? [...ids, row.id] : ids.filter(id => id !== row.id))} /></td>
              {columns.map(col => <td key={String(col.key)}>{col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}</td>)}
              <td>
                <Button size="sm" onClick={() => { setEditingUser(row); setIsEditDialogOpen(true); }}>编辑</Button>
                <Button size="sm" variant="destructive" onClick={() => { setDeleteTargetId(row.id); setDeleteDialogOpen(true); }}>删除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddUserDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      {editingUser && <EditUserDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} user={editingUser} />}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={async () => {
              if (deleteBatch) {
                await handleDelete(selectedIds);
                setSelectedIds([]);
              } else if (deleteTargetId) {
                await handleDelete([deleteTargetId]);
              }
              setDeleteDialogOpen(false);
            }}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 