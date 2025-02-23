import { SupportedLanguage } from '@/constants/language'

export interface LanguageServerConfig {
  id: SupportedLanguage
  label: string
  hostname: string
  protocol: string
  port: number | null
  path: string | null
}

export const SUPPORTED_LANGUAGE_SERVERS: LanguageServerConfig[] = [
  {
    id: "c",
    label: "C",
    protocol: process.env.NEXT_PUBLIC_LSP_C_PROTOCOL || "ws",
    hostname: process.env.NEXT_PUBLIC_LSP_C_HOSTNAME || "localhost",
    port: process.env.NEXT_PUBLIC_LSP_C_PORT ? parseInt(process.env.NEXT_PUBLIC_LSP_C_PORT, 10) : 4594,
    path: process.env.NEXT_PUBLIC_LSP_C_PATH || "/clangd",
  },
  {
    id: "cpp",
    label: "C++",
    protocol: process.env.NEXT_PUBLIC_LSP_CPP_PROTOCOL || "ws",
    hostname: process.env.NEXT_PUBLIC_LSP_CPP_HOSTNAME || "localhost",
    port: process.env.NEXT_PUBLIC_LSP_CPP_PORT ? parseInt(process.env.NEXT_PUBLIC_LSP_CPP_PORT, 10) : 4595,
    path: process.env.NEXT_PUBLIC_LSP_CPP_PATH || "/clangd",
  },
];
