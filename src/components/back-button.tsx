import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BackButtonProps {
  href: string;
  className?: string;
}

export default function BackButton({
  href,
  className,
  ...props
}: BackButtonProps) {
  const t = useTranslations();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn("h-8 w-auto p-2", className)}
            asChild
            {...props}
          >
            <Link href={href}>
              <ArrowLeftIcon size={16} aria-hidden="true" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {t("BackButton")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
