"use client";

import { toast } from "sonner";
import { Locale } from "@/generated/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";
import React, { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { CoreEditor } from "@/components/core-editor";
import { getProblemData } from "@/app/actions/getProblem";
import { VideoEmbed } from "@/components/content/video-embed";
import { getProblemLocales } from "@/app/actions/getProblemLocales";
import { PanelLayout } from "@/features/problems/layouts/panel-layout";
import { updateProblemSolution } from "@/components/creater/problem-maintain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditSolutionPanel({
  problemId,
}: {
  problemId: string;
}) {
  const [locales, setLocales] = useState<string[]>([]);
  const [currentLocale, setCurrentLocale] = useState<string>("");
  const [customLocale, setCustomLocale] = useState("");

  const [solution, setSolution] = useState({ title: "", content: "" });
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "compare">(
    "edit"
  );

  useEffect(() => {
    async function fetchLocales() {
      try {
        const langs = await getProblemLocales(problemId);
        setLocales(langs);
        if (langs.length > 0) setCurrentLocale(langs[0]);
      } catch (err) {
        console.error(err);
        toast.error("获取语言列表失败");
      }
    }
    fetchLocales();
  }, [problemId]);

  useEffect(() => {
    if (!currentLocale) return;
    async function fetchSolution() {
      try {
        const data = await getProblemData(problemId, currentLocale);
        setSolution({
          title: (data?.title || "") + " 解析",
          content: data?.solution || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("加载题目解析失败");
      }
    }
    fetchSolution();
  }, [problemId, currentLocale]);

  const handleAddCustomLocale = () => {
    if (customLocale && !locales.includes(customLocale)) {
      setLocales((prev) => [...prev, customLocale]);
      setCurrentLocale(customLocale);
      setCustomLocale("");
      setSolution({ title: "", content: "" });
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!currentLocale) {
      toast.error("请选择语言");
      return;
    }
    try {
      const locale = currentLocale as Locale;
      const res = await updateProblemSolution(
        problemId,
        locale,
        solution.content
      );
      if (res.success) {
        toast.success("保存成功");
      } else {
        toast.error("保存失败");
      }
    } catch (err) {
      console.error(err);
      toast.error("保存异常");
    }
  };

  return (
    <PanelLayout>
      <Card className="w-full rounded-none border-none bg-background">
        <CardHeader>
          <CardTitle>题目解析</CardTitle>
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
              <Button type="button" onClick={handleAddCustomLocale}>
                添加
              </Button>
            </div>
          </div>

          {/* 标题输入 (仅展示) */}
          <div className="space-y-2">
            <Label htmlFor="solution-title">题解标题</Label>
            <Input
              id="solution-title"
              value={solution.title}
              onChange={(e) =>
                setSolution({ ...solution, title: e.target.value })
              }
              placeholder="输入题解标题"
              disabled
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
              onClick={() =>
                setViewMode(viewMode === "preview" ? "edit" : "preview")
              }
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
          <div
            className={
              viewMode === "compare"
                ? "grid grid-cols-2 gap-6"
                : "flex flex-col gap-6"
            }
          >
            {(viewMode === "edit" || viewMode === "compare") && (
              <div className="relative h-[600px]">
                <CoreEditor
                  value={solution.content}
                  onChange={(val) =>
                    setSolution({ ...solution, content: val || "" })
                  }
                  language="markdown"
                  className="absolute inset-0 rounded-md border border-input"
                />
              </div>
            )}
            {viewMode !== "edit" && (
              <div className="prose dark:prose-invert">
                <MdxPreview
                  source={solution.content}
                  components={{ Accordion, VideoEmbed }}
                />
              </div>
            )}
          </div>

          <Button type="button" onClick={handleSave}>
            保存更改
          </Button>
        </CardContent>
      </Card>
    </PanelLayout>
  );
}
