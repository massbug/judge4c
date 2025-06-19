import "@/app/globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full antialiased">
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}