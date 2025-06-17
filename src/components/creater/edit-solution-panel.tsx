"use client";

import { useEffect, useState } from "react";
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

export default function EditSolutionPanel({ problemId }: { problemId: string }) {
  const [locales, setLocales] = useState<string[]>([]);
  const [currentLocale, setCurrentLocale] = useState<string>("");
  const [customLocale, setCustomLocale] = useState("");

  const [solution, setSolution] = useState({ title: "", content: "" });
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "compare">("edit");

  useEffect(() => {
    async function fetchLocales() {
      const langs = await getProblemLocales(problemId);
      setLocales(langs);
      if (langs.length > 0) setCurrentLocale(langs[0]);
    }
    fetchLocales();
  }, [problemId]);

  useEffect(() => {
    if (!currentLocale) return;
    async function fetchSolution() {
      const data = await getProblemData(problemId, currentLocale);
      setSolution({
        title: (data?.title || "") + " 解析",
        content: data?.solution || "",
      });
    }
    fetchSolution();
  }, [problemId, currentLocale]);

  function handleAddCustomLocale() {
    if (customLocale && !locales.includes(customLocale)) {
      const newLocales = [...locales, customLocale];
      setLocales(newLocales);
      setCurrentLocale(customLocale);
      setCustomLocale("");
      setSolution({ title: "", content: "" });
    }
  }

  return (
      <Card className="w-full">
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
              <Button onClick={handleAddCustomLocale}>添加</Button>
            </div>
          </div>

          {/* 标题输入 */}
          <div className="space-y-2">
            <Label htmlFor="solution-title">题解标题</Label>
            <Input
                id="solution-title"
                value={solution.title}
                onChange={(e) => setSolution({ ...solution, title: e.target.value })}
                placeholder="输入题解标题"
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
                      value={solution.content}
                      onChange={(val) => setSolution({ ...solution, content: val || "" })}
                      language="markdown"
                      className="absolute inset-0 rounded-md border border-input"
                  />
                </div>
            )}
            {viewMode !== "edit" && (
                <div className="prose dark:prose-invert">
                  <MdxPreview source={solution.content} components={{ Accordion, VideoEmbed }} />
                </div>
            )}
          </div>

          <Button>保存更改</Button>
        </CardContent>
      </Card>
  );
}
