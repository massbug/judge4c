import {
  AlertTriangleIcon,
  BanIcon,
  CircleCheckIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Status } from "@/generated/client";
import { Button } from "@/components/ui/button";

interface JudgeToastProps {
  t: number | string;
  status: Status;
}

const getIconForStatus = (status: Status) => {
  switch (status) {
    case Status.PD:
    case Status.QD:
    case Status.CP:
    case Status.CE:
    case Status.RU:
    case Status.TLE:
    case Status.MLE:
    case Status.RE:
    case Status.WA:
      return AlertTriangleIcon;
    case Status.CS:
    case Status.AC:
      return CircleCheckIcon;
    case Status.SE:
      return BanIcon;
  }
};

const getColorClassForStatus = (status: Status) => {
  switch (status) {
    case Status.PD:
    case Status.QD:
      return "text-gray-500";
    case Status.CP:
    case Status.CE:
      return "text-yellow-500";
    case Status.CS:
    case Status.AC:
      return "text-green-500";
    case Status.RU:
    case Status.TLE:
      return "text-blue-500";
    case Status.MLE:
      return "text-purple-500";
    case Status.RE:
      return "text-orange-500";
    case Status.WA:
    case Status.SE:
      return "text-red-500";
  }
};

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
