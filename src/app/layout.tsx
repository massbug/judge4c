import "@/app/globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsDialog } from "@/components/settings-dialog";

export const metadata: Metadata = {
  title: "Judge4c",
  description:
    "A full-stack, open-source online judge platform designed to elevate college programming education.",
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
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
