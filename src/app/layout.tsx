import "@/app/globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsDialog } from "@/components/settings-dialog";

export const metadata: Metadata = {
  title: "monaco-editor-lsp-next",
  description:
    "A Next.js integration of Monaco Editor with LSP support, free from SSR issues",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full">{children}</div>
          <SettingsDialog />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
