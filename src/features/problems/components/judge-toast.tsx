import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Status } from "@/generated/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getColorClassForStatus, getIconForStatus } from "@/config/status";

interface JudgeToastProps {
  t: number | string;
  status: Status;
}

export const JudgeToast = ({ t, status }: JudgeToastProps) => {
  const s = useTranslations("StatusMessage");
  const Icon = getIconForStatus(status);
  const colorClass = getColorClassForStatus(status);

  return (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-1 shadow-lg h-10 flex items-center">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <Icon
            className={cn("mt-0.5 shrink-0", colorClass)}
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{s(status)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close toast"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
};
