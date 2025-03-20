import { useTheme } from "next-themes";
import { MonacoTheme } from "@/types/monaco-theme";
import { MonacoThemeConfig } from "@/config/monaco-theme";

export function useMonacoTheme() {
  const { resolvedTheme } = useTheme();

  const currentTheme = resolvedTheme === "light" ? MonacoThemeConfig[MonacoTheme.GitHubLightDefault].id : MonacoThemeConfig[MonacoTheme.GitHubDarkDefault].id;

  return {
    currentTheme,
  };
}
