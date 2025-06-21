import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default async function ProtectedLayout({
  children,
  allowedRoles,
}: ProtectedLayoutProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || !allowedRoles.includes(user.role)) {
    redirect("/sign-in");
  }

  return <div className="w-full h-full">{children}</div>;
}
