import { useTheme } from "next-themes";

export const useMonacoTheme = () => {
  const { resolvedTheme } = useTheme();

  const theme =
    resolvedTheme === "light" ? "github-light-default" : "github-dark-default";

  return { theme };
};
