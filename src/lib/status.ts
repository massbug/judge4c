import {
  AlertTriangleIcon,
  BanIcon,
  CircleCheckIcon,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Status } from "@/generated/client";

export const getStatusColorClass = (status: Status) => {
  const colorMap: Record<Status, string> = {
    PD: "text-gray-500",
    QD: "text-gray-500",
    CP: "text-yellow-500",
    CE: "text-yellow-500",
    CS: "text-green-500",
    RU: "text-blue-500",
    TLE: "text-blue-500",
    MLE: "text-purple-500",
    RE: "text-orange-500",
    AC: "text-green-500",
    WA: "text-red-500",
    SE: "text-red-500",
  };
  return colorMap[status] || "text-gray-500";
};

export const statusMap = new Map<Status, { icon: LucideIcon; message: string }>([
  ["PD", { icon: AlertTriangleIcon, message: "PD" }],
  ["QD", { icon: AlertTriangleIcon, message: "QD" }],
  ["CP", { icon: AlertTriangleIcon, message: "CP" }],
  ["CE", { icon: AlertTriangleIcon, message: "CE" }],
  ["CS", { icon: CircleCheckIcon, message: "CS" }],
  ["RU", { icon: AlertTriangleIcon, message: "RU" }],
  ["TLE", { icon: AlertTriangleIcon, message: "TLE" }],
  ["MLE", { icon: AlertTriangleIcon, message: "MLE" }],
  ["RE", { icon: AlertTriangleIcon, message: "RE" }],
  ["AC", { icon: CircleCheckIcon, message: "AC" }],
  ["WA", { icon: AlertTriangleIcon, message: "WA" }],
  ["SE", { icon: BanIcon, message: "SE" }],
]);
