"use client";

import { Actions } from "flexlayout-react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProblemFlexLayoutStore } from "@/stores/problem-flexlayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DetailHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const t = useTranslations("DetailsPage");
  const { model } = useProblemFlexLayoutStore();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("submissionId");
    router.push(`${pathname}?${params.toString()}`);
    if (!model) return;
    model.doAction(Actions.selectTab("submission"));
    const detailTab = model.getNodeById("detail");
    if (detailTab) {
      model.doAction(Actions.deleteTab("detail"));
    }
  };

  return (
    <div className="h-8 flex flex-none items-center px-2 py-1 border-b">
      <Button
        onClick={handleClick}
        variant="ghost"
        className="h-8 w-auto p-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon size={16} aria-hidden="true" />
        <span>{t("BackButton")}</span>
      </Button>
    </div>
  );
};
