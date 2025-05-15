"use client";

import {
  BotIcon,
  CircleCheckBigIcon,
  FileTextIcon,
  FlaskConicalIcon,
  SquareCheckIcon,
  SquarePenIcon,
} from "lucide-react";
import { Locale } from "@/config/i18n";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Dockview from "@/components/dockview";
import { useDockviewStore } from "@/stores/dockview";
import { AIProblemEditor } from "@/components/ai-optimized-editor";

interface ProblemPageProps {
  locale: Locale;
  Description: React.ReactNode;
  Solutions: React.ReactNode;
  Submissions: React.ReactNode;
  Details: React.ReactNode;
  Code: React.ReactNode;
  Testcase: React.ReactNode;
  Bot: React.ReactNode;
}

export default function ProblemPage({
  locale,
  Description,
  Solutions,
  Submissions,
  Details,
  Code,
  Testcase,
  Bot,
}: ProblemPageProps) {
  const [key, setKey] = useState(0);
  const { setApi } = useDockviewStore();
  const t = useTranslations("ProblemPage");
  const pathname = usePathname();
  const problemId = pathname.split("/").pop(); // 从URL提取problemId
  
  // AI优化相关状态
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [userCode, setUserCode] = useState(`function example() {
  // 初始代码
  return "Hello World";
}`);
  
  // 修改Code面板内容以包含切换功能
  const CodeWithToggle = (
    <div className="p-2">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setShowAIEditor(!showAIEditor)}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
        >
          {showAIEditor ? "普通编辑器" : "AI优化编辑器"}
        </button>
        
        {showAIEditor && (
          <button
            onClick={() => setShowAIEditor(false)}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
          >
            返回编辑
          </button>
        )}
      </div>
      
      {showAIEditor ? (
        <AIProblemEditor
          initialCode={userCode}
          problemId={problemId}
          onCodeChange={setUserCode}
        />
      ) : (
        // 原始Code组件保持不变
        <div className="h-[500px]">
          {Code}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [locale]);

  // 修改Dockview配置：更新Code面板引用
  return (
    <Dockview
      key={key}
      storageKey="dockview:problem"
      onApiReady={setApi}
      options={[
        {
          id: "Description",
          component: "Description",
          tabComponent: "Description",
          params: {
            icon: FileTextIcon,
            content: Description,
            title: t("Description"),
          },
        },
        {
          id: "Solutions",
          component: "Solutions",
          tabComponent: "Solutions",
          params: {
            icon: FlaskConicalIcon,
            content: Solutions,
            title: t("Solutions"),
          },
          position: {
            referencePanel: "Description",
            direction: "within",
          },
          inactive: true,
        },
        {
          id: "Submissions",
          component: "Submissions",
          tabComponent: "Submissions",
          params: {
            icon: CircleCheckBigIcon,
            content: Submissions,
            title: t("Submissions"),
          },
          position: {
            referencePanel: "Solutions",
            direction: "within",
          },
          inactive: true,
        },
        {
          id: "Details",
          component: "Details",
          tabComponent: "Details",
          params: {
            icon: CircleCheckBigIcon,
            content: Details,
            title: t("Details"),
            autoAdd: false,
          },
        },
        {
          id: "Code",
          component: "Code",
          tabComponent: "Code",
          params: {
            icon: SquarePenIcon,
            content: CodeWithToggle, // 替换为带切换功能的容器
            title: t("Code"),
          },
          position: {
            referencePanel: "Submissions",
            direction: "right",
          },
        },
        {
          id: "Testcase",
          component: "Testcase",
          tabComponent: "Testcase",
          params: {
            icon: SquareCheckIcon,
            content: Testcase,
            title: t("Testcase"),
          },
          position: {
            referencePanel: "Code",
            direction: "below",
          },
        },
        {
          id: "Bot",
          component: "Bot",
          tabComponent: "Bot",
          params: {
            icon: BotIcon,
            content: Bot,
            title: t("Bot"),
            autoAdd: false,
          },
          position: {
            direction: "right",
          },
        },
      ]}
    />
  );
}
