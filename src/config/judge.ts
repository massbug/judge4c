export interface LanguageConfig {
  id: string;
  label: string;
  fileName: string;
  extension: string;
  image: string;
  tag: string;
  workingDir: string;
  timeout: number;
}

export const LanguageConfigs: Record<string, LanguageConfig> = {
  c: {
    id: "c",
    label: "C",
    fileName: "main",
    extension: "c",
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    timeout: 1000,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    fileName: "main",
    extension: "cpp",
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    timeout: 1000,
  },
};
