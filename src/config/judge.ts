// Result type definitions
export enum ExitCode {
  SE  = 0,  // System Error
  CS  = 1,  // Compilation Success
  CE  = 2,  // Compilation Error
  TLE = 3,  // Time Limit Exceeded
  MLE = 4,  // Memory Limit Exceeded
  RE  = 5,  // Runtime Error
  AC  = 6,  // Accepted
  WA  = 7,  // Wrong Answer
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
  fileExtension: string;
  image: string;
  tag: string;
  workingDir: string;
  timeLimit: number;
  memoryLimit: number;
  compileOutputLimit: number;
  runOutputLimit: number;
}

export const LanguageConfigs: Record<string, LanguageConfig> = {
  c: {
    id: "c",
    label: "C",
    fileName: "main",
    fileExtension: "c",
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    timeLimit: 1000,
    memoryLimit: 128,
    compileOutputLimit: 1 * 1024 * 1024,
    runOutputLimit: 1 * 1024 * 1024,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    fileName: "main",
    fileExtension: "cpp",
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    timeLimit: 1000,
    memoryLimit: 128,
    compileOutputLimit: 1 * 1024 * 1024,
    runOutputLimit: 1 * 1024 * 1024,
  },
};
