"use client";

import { CodeXmlIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SubmissionLoginButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogIn = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("redirectTo", pathname);
    router.push(`/sign-in?${params.toString()}`);
  };

  return (
    <div className="flex h-full flex-col items-center justify-start gap-2 pt-[10vh]">
      <div className="flex items-center gap-3">
        <CodeXmlIcon
          className="shrink-0 text-blue-500"
          size={16}
          aria-hidden="true"
        />
        <p className="text-base font-medium">Join Judge4c to Code!</p>
      </div>
      <p className="text-sm text-muted-foreground">
        View your Submission records here
      </p>
      <Button size="sm" onClick={handleLogIn}>
        Log In
      </Button>
    </div>
  );
}
