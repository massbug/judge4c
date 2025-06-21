"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboardIcon } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const DashboardButton = () => {
  const router = useRouter();

  return (
    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
      <LayoutDashboardIcon />
      Dashboard
    </DropdownMenuItem>
  );
};
