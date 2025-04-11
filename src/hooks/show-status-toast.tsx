import {
  LucideIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Status } from "@/generated/client";
import { getStatusColorClass, statusMap } from "@/lib/status";

const StatusToast = ({
  t,
  Icon,
  message,
  colorClass,
}: {
  t: string | number;
  Icon: LucideIcon;
  message: string;
  colorClass: string;
}) => (
  <div className="bg-background text-foreground w-full rounded-md border px-4 py-1 shadow-lg h-10 flex items-center">
    <div className="flex gap-2">
      <div className="flex grow gap-3">
        <Icon
          className={`mt-0.5 shrink-0 ${colorClass}`}
          size={16}
          aria-hidden="true"
        />
        <div className="flex grow justify-between gap-12">
          <p className="text-sm">{message}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
        onClick={() => toast.dismiss(t)}
        aria-label="Close sonner"
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

interface ShowStatusToastProps {
  status: Status;
}

export function showStatusToast({
  status,
}: ShowStatusToastProps) {
  const { icon: Icon, message } = statusMap.get(status) || {
    icon: XIcon,
    message: "Unknown Error",
  };
  const colorClass = getStatusColorClass(status);

  toast.custom((t) => (
    <StatusToast
      t={t}
      Icon={Icon}
      message={message}
      colorClass={colorClass}
    />
  ));
}
