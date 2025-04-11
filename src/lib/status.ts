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
  ["PD", { icon: AlertTriangleIcon, message: "Pending" }],
  ["QD", { icon: AlertTriangleIcon, message: "Queued" }],
  ["CP", { icon: AlertTriangleIcon, message: "Compiling" }],
  ["CE", { icon: AlertTriangleIcon, message: "Compilation Error" }],
  ["CS", { icon: CircleCheckIcon, message: "Compilation Success" }],
  ["RU", { icon: AlertTriangleIcon, message: "Running" }],
  ["TLE", { icon: AlertTriangleIcon, message: "Time Limit Exceeded" }],
  ["MLE", { icon: AlertTriangleIcon, message: "Memory Limit Exceeded" }],
  ["RE", { icon: AlertTriangleIcon, message: "Runtime Error" }],
  ["AC", { icon: CircleCheckIcon, message: "Accepted" }],
  ["WA", { icon: AlertTriangleIcon, message: "Wrong Answer" }],
  ["SE", { icon: BanIcon, message: "System Error" }],
]);
