"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import RunCode from "./run-code";
import SettingsButton from "./settings-button";
import { SettingsDialog } from "./settings-dialog";

interface HeaderProps {
  className?: string;
}

export function Header({
  className,
  ...props
}: HeaderProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  return (
    <header
      {...props}
      className={cn("relative", className)}
    >
      <nav className="relative h-12 w-full flex shrink-0 items-center px-2.5">
        <div className="w-full flex justify-between">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center"></div>
            <div className="relative flex items-center gap-2">
              <SettingsButton onClick={toggleDialog} />
            </div>
          </div>
        </div>
      </nav>
      <div className="z-10 absolute left-1/2 top-0 h-full -translate-x-1/2 py-2">
        <div className="relative flex">
          <div className="relative flex overflow-hidden rounded">
            <RunCode />
          </div>
        </div>
      </div>
      <SettingsDialog open={isDialogOpen} onClose={toggleDialog} />
    </header>
  );
}
