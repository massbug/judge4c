"use client";

import "@/styles/mdx.css";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// import rehypeSlug from "rehype-slug";
import { MDXProvider } from "@mdx-js/react";
import rehypePretty from "rehype-pretty-code";
import { Skeleton } from "@/components/ui/skeleton";
import { serialize } from "next-mdx-remote/serialize";
import { useCallback, useEffect, useState } from "react";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MdxPreviewProps {
  source: string;
  components?: React.ComponentProps<typeof MDXProvider>["components"];
  className?: string;
}

export default function MdxPreview({
  source,
  components,
  className,
}: MdxPreviewProps) {
  const { theme } = useMonacoTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );

  const getMdxSource = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mdxSource = await serialize(source, {
        mdxOptions: {
          rehypePlugins: [
            // rehypeSlug,
            // [
            //   rehypeAutolinkHeadings,
            //   {
            //     behavior: "wrap",
            //     properties: {
            //       className: ["subheading-anchor"],
            //       ariaLabel: "Link to section",
            //     },
            //   },
            // ],
            [
              rehypePretty,
              {
                theme: theme,
                keepBackground: false,
              },
            ],
            rehypeKatex,
          ],
          remarkPlugins: [remarkGfm, remarkMath],
        },
      });
      setMdxSource(mdxSource);
    } catch (error) {
      console.error("Failed to serialize Mdx:", error);
      setError("Failed to load mdx content.");
    } finally {
      setIsLoading(false);
    }
  }, [source, theme]);

  // Delay the serialize process to the next event loop to avoid flickering
  // when copying code to the editor and the MDX preview shrinks.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getMdxSource(); // Execute serializeMdx in the next event loop
    }, 0);

    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
  }, [getMdxSource]);

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <Skeleton className="h-full w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="rounded-lg border border-red-500/50 px-4 py-3 text-red-600">
          <p className="text-sm">
            <CircleAlert
              className="-mt-0.5 me-3 inline-flex opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="rounded-lg border border-amber-500/50 px-4 py-3 text-amber-600">
          <p className="text-sm">
            <TriangleAlert
              className="-mt-0.5 me-3 inline-flex opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            No content to preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className={cn("markdown-body", className)}>
      <MDXRemote {...mdxSource!} components={components} />
    </article>
  );
}
