import "@/app/globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsDialog } from "@/components/settings-dialog";
import { getUserLocale } from "@/services/locale";
import IntlProvider from "@/components/intl-provider";
import React from "react";

export const metadata: Metadata = {
    title: "Judge4c",
    description:
        "A full-stack, open-source online judge platform designed to elevate college programming education.",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    let locale = await getUserLocale();

    if (!locale) {
        console.warn("未检测到用户语言，使用默认语言 'en'");
        locale = "en";
    } else {
        console.log(`检测到用户语言：${locale}`);
    }

    let messages;
    try {
        messages = (await import(`../../messages/${locale}.json`)).default;
        console.log(`已成功加载语言文件: messages/${locale}.json`);
    } catch (error) {
        console.error(
            `加载语言文件 messages/${locale}.json 失败，回退到 messages/en.json`,
            error
        );
        locale = "en";
        messages = (await import(`../../messages/en.json`)).default;
    }

    return (
        <html lang={locale} className="h-full" suppressHydrationWarning>
        <body className="flex min-h-full antialiased">
        <IntlProvider locale={locale} messages={messages}>
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
        </IntlProvider>
        </body>
        </html>
    );
}
