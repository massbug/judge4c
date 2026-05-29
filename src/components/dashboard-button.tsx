"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboardIcon } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const DashboardButton = () => {
  const router = useRouter();
  const t = useTranslations("UserAvatar");

  return (
    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
      <LayoutDashboardIcon />
      {t("Dashboard")}
    </DropdownMenuItem>
  );
};
