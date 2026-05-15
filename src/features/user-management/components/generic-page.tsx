import prisma from "@/lib/prisma";
import { UserTable } from "./user-table";
import { Role } from "@/generated/client";
import { UserConfig } from "./user-table";
import type { User, Problem } from "@/generated/client";

interface GenericPageProps {
  resourceType: "admin" | "teacher" | "student" | "problem";
  config: UserConfig;
}

export default async function GenericPage({
  resourceType,
  config,
}: GenericPageProps) {
  if (resourceType === "problem") {
    const data: Problem[] = await prisma.problem.findMany({});
    return <UserTable config={config} data={data} />;
  } else {
    const role = resourceType.toUpperCase() as Role;
    const data: User[] = await prisma.user.findMany({ where: { role } });
    return <UserTable config={config} data={data} />;
  }
}
