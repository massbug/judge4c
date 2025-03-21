"use client";

import { Settings } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SettingsButton() {
  const { setDialogOpen } = useSettingsStore();

  return (
    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
      <Settings />
      Settings
    </DropdownMenuItem>
  );
}
