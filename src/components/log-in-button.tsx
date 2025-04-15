"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LogInButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("AvatarButton");

  const handleLogIn = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("redirectTo", pathname);
    router.push(`/sign-in?${params.toString()}`);
  };

  return (
    <DropdownMenuItem onClick={handleLogIn}>
      <LogIn />
      {t("LogIn")}
    </DropdownMenuItem>
  );
}
