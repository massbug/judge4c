"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/stores/useSettingsStore";

const fontSizes = [12, 13, 14, 15, 16, 18, 20];

export function CodeEditorSettings() {
  const t = useTranslations("CodeEditorSettings");
  const { editorSettings, setEditorSetting } = useSettingsStore();

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <Label>{t("fontSize")}</Label>
        <Select
          value={editorSettings.fontSize.toString()}
          onValueChange={(value) =>
            setEditorSetting("fontSize", Number(value))
          }
        >
          <SelectTrigger className="w-[160px] shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((fontSize) => (
              <SelectItem key={fontSize} value={fontSize.toString()}>
                {fontSize}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <EditorSwitch
        label={t("wordWrap")}
        description={t("wordWrapDescription")}
        checked={editorSettings.wordWrap}
        onCheckedChange={(checked) => setEditorSetting("wordWrap", checked)}
      />
      <EditorSwitch
        label={t("minimap")}
        description={t("minimapDescription")}
        checked={editorSettings.minimap}
        onCheckedChange={(checked) => setEditorSetting("minimap", checked)}
      />
      <EditorSwitch
        label={t("stickyScroll")}
        description={t("stickyScrollDescription")}
        checked={editorSettings.stickyScroll}
        onCheckedChange={(checked) => setEditorSetting("stickyScroll", checked)}
      />
    </div>
  );
}

interface EditorSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function EditorSwitch({
  label,
  description,
  checked,
  onCheckedChange,
}: EditorSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
