'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";


export default function ForbiddenPage() {
    const handleGoBack = () => {
        redirect("/")
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-6xl font-bold text-red-500">403</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl mb-6 text-muted-foreground">你无权访问该页面</p>
                    <Button onClick={handleGoBack} variant="default">
                        返回上一页
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
