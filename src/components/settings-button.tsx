"use client";

import { SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SettingsButton() {
  const t = useTranslations("UserAvatar");
  const { setDialogOpen } = useSettingsStore();

  return (
    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
      <SettingsIcon />
      {t("Settings")}
    </DropdownMenuItem>
  );
}
