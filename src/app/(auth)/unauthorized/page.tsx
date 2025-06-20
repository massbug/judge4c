"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-red-500 text-6xl font-bold">403</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-xl text-muted-foreground">你无权访问该页面</p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleGoBack} variant="secondary">
              <ArrowLeftIcon />
              <span>返回</span>
            </Button>
            <Button onClick={handleGoHome}>
              <HomeIcon />
              <span>首页</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
