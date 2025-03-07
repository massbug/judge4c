import "@/style/mdx.css";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { Skeleton } from "@/components/ui/skeleton";
import { MdxComponents } from "@/components/content/mdx-components";
import { DefaultDarkThemeConfig, DefaultLightThemeConfig } from "@/config/monaco-theme";

interface MdxRendererProps {
  source: string;
  className?: string;
}

export function MdxRenderer({ source, className }: MdxRendererProps) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full p-4">
          <Skeleton className="h-full w-full rounded-3xl" />
        </div>
      }
    >
      <article className={cn("markdown-body", className)}>
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              rehypePlugins: [
                rehypeKatex,
                [
                  rehypePrettyCode,
                  {
                    theme: {
                      light: DefaultLightThemeConfig.id,
                      dark: DefaultDarkThemeConfig.id,
                    },
                    keepBackground: false,
                  },
                ],
              ],
              remarkPlugins: [remarkGfm, remarkMath],
            },
          }}
          components={MdxComponents}
        />
      </article>
    </Suspense>
  );
}
