import prisma from "@/lib/prisma";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AdminProtectedLayoutProps {
  children: React.ReactNode;
}

export const AdminProtectedLayout = async ({
  children,
}: AdminProtectedLayoutProps) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    await signIn();
  }

  const user = await prisma.user.findUnique({
    select: {
      role: true,
    },
    where: {
      id: userId,
    },
  });

  if (user?.role !== "ADMIN") redirect("/unauthorized");

  return <>{children}</>;
};
