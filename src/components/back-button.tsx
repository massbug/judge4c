import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";

interface BackButtonProps {
  href: string;
  className?: string;
}

export const BackButton = ({ href, className }: BackButtonProps) => {
  const t = useTranslations();

  return (
    <TooltipButton
      tooltipContent={t("BackButton")}
      className={cn("h-8 w-auto p-2", className)}
      asChild
    >
      <Link href={href}>
        <ArrowLeftIcon size={16} aria-hidden="true" />
      </Link>
    </TooltipButton>
  );
};
