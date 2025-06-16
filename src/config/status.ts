import { Status } from "@/generated/client";
import { AlertTriangleIcon, BanIcon, CircleCheckIcon } from "lucide-react";

export const getIconForStatus = (status: Status) => {
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

export const getColorClassForStatus = (status: Status) => {
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

export const getColorClassForLspStatus = (webSocket: WebSocket | null) => {
  if (!webSocket) return "bg-gray-500";
  switch (webSocket.readyState) {
    case WebSocket.CONNECTING:
      return "bg-sky-500 animate-pulse";
    case WebSocket.OPEN:
      return "bg-emerald-500";
    case WebSocket.CLOSING:
      return "bg-amber-500 animate-pulse";
    case WebSocket.CLOSED:
      return "bg-red-500";
  }
};
