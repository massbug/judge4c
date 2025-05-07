import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface TooltipButtonProps extends ButtonProps {
  children: React.ReactNode;
  delayDuration?: number;
  tooltipContent: string;
  className?: string;
}

const TooltipButton = ({
  children,
  delayDuration = 0,
  tooltipContent,
  className,
  ...props
}: TooltipButtonProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-6 w-6 px-1.5 py-0.5 border-none shadow-none hover:bg-muted",
              className
            )}
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TooltipButton };
