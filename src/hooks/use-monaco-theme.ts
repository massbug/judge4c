import { useTheme } from "next-themes";
import { DefaultLightThemeConfig, DefaultDarkThemeConfig } from "@/config/monaco-theme";

export function useMonacoTheme() {
  const { resolvedTheme } = useTheme();

  const currentTheme = resolvedTheme === "light" ? DefaultLightThemeConfig.id : DefaultDarkThemeConfig.id;

  return {
    currentTheme,
  };
}
