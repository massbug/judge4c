"use client";

import "@/style/mdx.css";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useTheme } from "next-themes";
import rehypePretty from "rehype-pretty-code";
import { Skeleton } from "@/components/ui/skeleton";
import { serialize } from "next-mdx-remote/serialize";
import { useCallback, useEffect, useState } from "react";
import { CircleAlert, TriangleAlert } from "lucide-react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MdxPreviewProps {
  source: string;
}

export default function MdxPreview({ source }: MdxPreviewProps) {
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  const components = {
    // Define your custom components here
    // For example:
    // Test: ({ name }: { name: string }) => <p>Test Component: {name}</p>,
  };

  const getMdxSource = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mdxSource = await serialize(source, {
        mdxOptions: {
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["subheading-anchor"],
                  ariaLabel: "Link to section",
                },
              }
            ],
            [
              rehypePretty,
              {
                theme: resolvedTheme === "light" ? "github-light-default" : "github-dark-default",
                keepBackground: false,
              },
            ],
          ],
          remarkPlugins: [remarkGfm],
        },
      });
      setMdxSource(mdxSource);
    } catch (error) {
      console.error("Failed to serialize Mdx:", error);
      setError("Failed to load mdx content.");
    } finally {
      setIsLoading(false);
    }
  }, [source, resolvedTheme]);

  // Delay the serialize process to the next event loop to avoid flickering
  // when copying code to the editor and the MDX preview shrinks.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getMdxSource(); // Execute serializeMdx in the next event loop
    }, 0);

    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
  }, [getMdxSource]);

  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-xl" />;
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="rounded-lg border border-red-500/50 px-4 py-3 text-red-600">
          <p className="text-sm">
            <CircleAlert className="-mt-0.5 me-3 inline-flex opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
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
            <TriangleAlert className="-mt-0.5 me-3 inline-flex opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
            No content to preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-56px)]">
      <div className="markdown-body">
        <MDXRemote {...mdxSource!} components={components} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
