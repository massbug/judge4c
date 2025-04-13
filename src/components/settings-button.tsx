"use client";

import { Settings } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export function SettingsButton() {
  const { setDialogOpen } = useSettingsStore();
  const t = useTranslations('settings');

  return (
    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
      <Settings />
      {t('settings')}
    </DropdownMenuItem>
  );
}
