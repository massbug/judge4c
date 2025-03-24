import {
  AlertTriangleIcon,
  BanIcon,
  CircleCheckIcon,
  LucideIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ExitCode } from "@prisma/client";
import { Button } from "@/components/ui/button";

const getColorClass = (code: ExitCode) => {
  const colorMap: Record<ExitCode, string> = {
    SE: "text-red-500",
    CS: "text-green-500",
    CE: "text-yellow-500",
    TLE: "text-blue-500",
    MLE: "text-purple-500",
    RE: "text-orange-500",
    AC: "text-green-500",
    WA: "text-red-500",
  };
  return colorMap[code] || "text-gray-500";
};

const exitCodeMap = new Map<ExitCode, { icon: LucideIcon; message: string }>([
  ["SE", { icon: BanIcon, message: "System Error" }],
  ["CS", { icon: CircleCheckIcon, message: "Compilation Success" }],
  ["CE", { icon: AlertTriangleIcon, message: "Compilation Error" }],
  ["TLE", { icon: AlertTriangleIcon, message: "Time Limit Exceeded" }],
  ["MLE", { icon: AlertTriangleIcon, message: "Memory Limit Exceeded" }],
  ["RE", { icon: AlertTriangleIcon, message: "Runtime Error" }],
  ["AC", { icon: CircleCheckIcon, message: "Accepted" }],
  ["WA", { icon: AlertTriangleIcon, message: "Wrong Answer" }],
]);

const ExitCodeToast = ({
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
  <div className="bg-background text-foreground w-full rounded-md border px-4 py-1 shadow-lg sm:w-[var(--width)]">
    <div className="flex gap-2">
      <div className="flex items-center grow gap-3">
        <Icon
          className={`mt-0.5 shrink-0 ${colorClass}`}
          size={16}
          aria-hidden="true"
        />
        <div className="flex grow justify-between gap-12">
          <p className="text-sm">{message}</p>
          <div className="text-sm whitespace-nowrap">
            <button className="text-sm font-medium hover:underline">Details</button>
          </div>
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

interface ShowExitCodeToastProps {
  exitCode: ExitCode;
}

export function showExitCodeToast({
  exitCode,
}: ShowExitCodeToastProps) {
  const { icon: Icon, message } = exitCodeMap.get(exitCode) || {
    icon: XIcon,
    message: "Unknown Error",
  };
  const colorClass = getColorClass(exitCode);

  toast.custom((t) => (
    <ExitCodeToast
      t={t}
      Icon={Icon}
      message={message}
      colorClass={colorClass}
    />
  ));
}
