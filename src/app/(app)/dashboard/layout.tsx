import { auth } from "@/lib/auth";
import { User } from "@/generated/client";
import { notFound, redirect } from "next/navigation";

interface DashboardLayoutProps {
  admin: React.ReactNode;
}

export default async function DashboardLayout({
  admin,
}: DashboardLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = session.user as User;

  return user.role === "ADMIN" ? admin : notFound();
}
