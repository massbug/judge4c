"use client";

import { LogIn } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LogInButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogIn = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("redirectTo", pathname);
    router.push(`/sign-in?${params.toString()}`);
  };

  return (
    <DropdownMenuItem onClick={handleLogIn}>
      <LogIn className="mr-2 h-4 w-4" />
      Log In
    </DropdownMenuItem>
  );
}
