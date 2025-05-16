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

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [locale]);

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
                content: Code,
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