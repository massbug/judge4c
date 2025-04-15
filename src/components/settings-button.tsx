"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SettingsButton() {
  const t = useTranslations("AvatarButton");
  const { setDialogOpen } = useSettingsStore();

  return (
    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
      <Settings />
      {t("Settings")}
    </DropdownMenuItem>
  );
}
