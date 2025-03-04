import { useTheme } from "next-themes";
import { MonacoThemeConfig } from "@/config/monaco-theme";

export function useMonacoTheme() {
  const { resolvedTheme } = useTheme();

  const monacoTheme = resolvedTheme === "light" ? MonacoThemeConfig.light : MonacoThemeConfig.dark;

  return {
    monacoTheme,
  };
}
