import prisma from "@/lib/prisma";
import { UserTable } from "./user-table";
import { Role } from "@/generated/client";
import { UserConfig } from "./user-table";
import type { User } from "@/generated/client";
import { getLocale } from "next-intl/server";

interface GenericPageProps {
  resourceType: "admin" | "teacher" | "student" | "problem";
  config: UserConfig;
}

export default async function GenericPage({
  resourceType,
  config,
}: GenericPageProps) {
  if (resourceType === "problem") {
    const locale = await getLocale();
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        displayId: true,
        difficulty: true,
        localizations: {
          where: { type: "TITLE", locale: locale === "en" ? "en" : "zh" },
          select: { content: true },
          take: 1,
        },
      },
      orderBy: { displayId: "asc" },
    });

    const data = problems.map((problem) => ({
      id: problem.id,
      displayId: problem.displayId,
      difficulty: problem.difficulty,
      title: problem.localizations[0]?.content ?? "-",
    }));

    return <UserTable config={config} data={data} />;
  } else {
    const role = resourceType.toUpperCase() as Role;
    const data: User[] = await prisma.user.findMany({ where: { role } });
    return <UserTable config={config} data={data} />;
  }
}
