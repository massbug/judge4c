import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from "lucide-react";

interface BannerProps {
  className?: string;
  link?: string;
  text?: string;
}

export function Banner({
  className,
  link = siteConfig.url.repo.github,
  text,
  ...props
}: BannerProps) {
  const t = useTranslations();

  return (
    <header
      {...props}
      className={cn(
        "h-12 flex flex-none items-center justify-center bg-muted text-foreground",
        className
      )}
    >
      <p className="flex justify-center text-sm">
        <a href={link} className="group">
          <span className="me-1 text-base leading-none">✨</span>
          {text || t("Banner.Text")}
          <ArrowRightIcon
            className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
            size={16}
            aria-hidden="true"
          />
        </a>
      </p>
    </header>
  );
}
