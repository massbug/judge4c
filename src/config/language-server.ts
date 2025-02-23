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
    protocol: "http",
    hostname: "localhost",
    port: 4594,
    path: "/clangd"
  },
  {
    id: "cpp",
    label: "C++",
    protocol: "http",
    hostname: "localhost",
    port: 4595,
    path: "/clangd"
  }
]
