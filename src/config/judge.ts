// Result type definitions
export enum ExitCode {
  AC  = 0,  // Accepted
  WA  = 1,  // Wrong Answer
  TLE = 2,  // Time Limit Exceeded
  MLE = 3,  // Memory Limit Exceeded
  RE  = 4,  // Runtime Error
  CE  = 5,  // Compilation Error
  PE  = 6,  // Presentation Error
  OLE = 7,  // Output Limit Exceeded
  SE  = 8,  // System Error
  SV  = 9   // Security Violation
}

export type JudgeResult = {
  output: string;
  exitCode: ExitCode;
  executionTime?: number;
  memoryUsage?: number;
};

export interface LanguageConfig {
  id: string;
  label: string;
  fileName: string;
  extension: string;
  image: string;
  tag: string;
  workingDir: string;
  timeout: number;
  memoryLimit: number;
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
    memoryLimit: 128,
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
    memoryLimit: 128,
  },
};
