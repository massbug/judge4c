import prisma from "@/lib/prisma";
import { Role } from "@/generated/client";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  roles: Role[];
  children: React.ReactNode;
}

export const ProtectedLayout = async ({
  roles,
  children,
}: ProtectedLayoutProps) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    await signIn();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || !roles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
};
