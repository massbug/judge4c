"use client"

import "@/app/globals.css";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { EditorConfigPanel } from '@/components/editor-config-panel';
import {useState} from "react";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <title>Judge4C</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 新增的配置面板按钮 */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
            <button
              onClick={() => setShowConfigPanel(true)}
              className="mt-2 px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              编辑器设置
            </button>
          </div>

          {/* 配置面板 */}
          {showConfigPanel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setShowConfigPanel(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                <EditorConfigPanel />
              </div>
            </div>
          )}

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
