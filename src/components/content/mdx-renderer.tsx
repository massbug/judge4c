import "@/styles/mdx.css";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { MdxComponents } from "@/components/content/mdx-components";

interface MdxRendererProps {
  source: string;
  className?: string;
}

export const MdxRenderer = ({ source, className }: MdxRendererProps) => {
  return (
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
                    light: "github-light-default",
                    dark: "github-dark-default",
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
  );
};
