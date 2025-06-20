"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreEditor } from "@/components/core-editor";
import MdxPreview from "@/components/mdx-preview";
import { getProblemData } from "@/app/actions/getProblem";
import { getProblemLocales } from "@/app/actions/getProblemLocales";
import { Accordion } from "@/components/ui/accordion";
import { VideoEmbed } from "@/components/content/video-embed";
import { toast } from "sonner";
import { updateProblemDescription, updateProblemTitle } from '@/components/creater/problem-maintain';
import { Locale } from "@/generated/client";

export default function EditDescriptionPanel({ problemId }: { problemId: string }) {
  const [locales, setLocales] = useState<string[]>([]);
  const [currentLocale, setCurrentLocale] = useState<string>("");
  const [customLocale, setCustomLocale] = useState("");

  const [description, setDescription] = useState({ title: "", content: "" });
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "compare">("edit");

  useEffect(() => {
    async function fetchLocales() {
      try {
        const langs = await getProblemLocales(problemId);
        setLocales(langs);
        if (langs.length > 0) setCurrentLocale(langs[0]);
      } catch (err) {
        console.error(err);
        toast.error('获取语言列表失败');
      }
    }
    fetchLocales();
  }, [problemId]);

  useEffect(() => {
    if (!currentLocale) return;
    async function fetchProblem() {
      try {
        const data = await getProblemData(problemId, currentLocale);
        setDescription({ title: data?.title || "", content: data?.description || "" });
      } catch (err) {
        console.error(err);
        toast.error('加载题目描述失败');
      }
    }
    fetchProblem();
  }, [problemId, currentLocale]);

  const handleAddCustomLocale = () => {
    if (customLocale && !locales.includes(customLocale)) {
      const newLocales = [...locales, customLocale];
      setLocales(newLocales);
      setCurrentLocale(customLocale);
      setCustomLocale("");
      setDescription({ title: "", content: "" });
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!currentLocale) {
      toast.error('请选择语言');
      return;
    }
    try {
      const locale = currentLocale as Locale;
      const resTitle = await updateProblemTitle(problemId, locale, description.title);
      const resDesc = await updateProblemDescription(problemId, locale, description.content);
      if (resTitle.success && resDesc.success) {
        toast.success('保存成功');
      } else {
        toast.error('保存失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('保存异常');
    }
  };

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>题目描述</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 语言切换 */}
          <div className="space-y-2">
            <Label>选择语言</Label>
            <div className="flex space-x-2">
              <select
                  value={currentLocale}
                  onChange={(e) => setCurrentLocale(e.target.value)}
                  className="border rounded-md px-3 py-2"
              >
                {locales.map((locale) => (
                    <option key={locale} value={locale}>
                      {locale}
                    </option>
                ))}
              </select>
              <Input
                  placeholder="添加新语言"
                  value={customLocale}
                  onChange={(e) => setCustomLocale(e.target.value)}
              />
              <Button onClick={handleAddCustomLocale}>添加</Button>
            </div>
          </div>

          {/* 标题输入 */}
          <div className="space-y-2">
            <Label htmlFor="description-title">标题</Label>
            <Input
                id="description-title"
                value={description.title}
                onChange={(e) => setDescription({ ...description, title: e.target.value })}
                placeholder="输入题目标题"
            />
          </div>

          {/* 编辑/预览切换 */}
          <div className="flex space-x-2">
            <Button
                type="button"
                variant={viewMode === "edit" ? "default" : "outline"}
                onClick={() => setViewMode("edit")}
            >
              编辑
            </Button>
            <Button
                type="button"
                variant={viewMode === "preview" ? "default" : "outline"}
                onClick={() => setViewMode(viewMode === "preview" ? "edit" : "preview")}
            >
              {viewMode === "preview" ? "取消" : "预览"}
            </Button>
            <Button
                type="button"
                variant={viewMode === "compare" ? "default" : "outline"}
                onClick={() => setViewMode("compare")}
            >
              对比
            </Button>
          </div>

          {/* 编辑/预览区域 */}
          <div className={viewMode === "compare" ? "grid grid-cols-2 gap-6" : "flex flex-col gap-6"}>
            {(viewMode === "edit" || viewMode === "compare") && (
                <div className="relative h-[600px]">
                  <CoreEditor
                      value={description.content}
                      onChange={(newVal) => setDescription({ ...description, content: newVal || "" })}
                      language="markdown"
                      className="absolute inset-0 rounded-md border border-input"
                  />
                </div>
            )}
            {viewMode !== "edit" && (
                <div className="prose dark:prose-invert">
                  <MdxPreview source={description.content} components={{ Accordion, VideoEmbed }} />
                </div>
            )}
          </div>

          <Button onClick={handleSave}>保存更改</Button>
        </CardContent>
      </Card>
  );
}
