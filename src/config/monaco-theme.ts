import { MonacoTheme } from "@/types/monaco-theme";

// Define theme configurations
const MonacoThemeConfig = {
  [MonacoTheme.GitHubLightDefault]: {
    id: MonacoTheme.GitHubLightDefault,
    label: "Github Light Default",
  },
  [MonacoTheme.GitHubDarkDefault]: {
    id: MonacoTheme.GitHubDarkDefault,
    label: "Github Dark Default",
  },
};

// Default Light and Dark theme configurations
const DefaultLightThemeConfig = MonacoThemeConfig[MonacoTheme.GitHubLightDefault];
const DefaultDarkThemeConfig = MonacoThemeConfig[MonacoTheme.GitHubDarkDefault];

export { MonacoThemeConfig, DefaultLightThemeConfig, DefaultDarkThemeConfig };
