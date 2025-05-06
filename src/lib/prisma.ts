import "server-only";

import { cache } from "react";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import { PrismaClient } from "@/generated/client";

const log = logger.child({ module: "prisma" });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

const getProblems = async () => {
  const startTime = Date.now();
  log.debug("Fetching all problems from database");
  try {
    const problems = await prisma.problem.findMany();
    log.debug(
      { count: problems.length, durationMs: Date.now() - startTime },
      "Fetched problems successfully"
    );
    return problems;
  } catch (error) {
    log.error(
      { durationMs: Date.now() - startTime, error },
      "Failed to fetch problems"
    );
    throw error;
  }
};

export const getCachedProblems = cache(
  unstable_cache(
    async () => {
      const startTime = Date.now();
      log.debug("Calling getProblemsCached (expect cache hit if warmed)");
      try {
        const result = await getProblems();
        log.info(
          { durationMs: Date.now() - startTime },
          "getProblemsCached finished"
        );
        return result;
      } catch (error) {
        log.error(
          { durationMs: Date.now() - startTime, error },
          "getProblemsCached failed"
        );
        throw error;
      }
    },
    ["getProblems"],
    {
      tags: ["problems"],
    }
  )
);

const getProblem = async (id: string) => {
  const startTime = Date.now();
  log.debug({ id }, "Fetching single problem");
  try {
    const problem = await prisma.problem.findUnique({ where: { id } });
    if (problem) {
      log.debug({ id, durationMs: Date.now() - startTime }, "Problem found");
    } else {
      log.warn({ id, durationMs: Date.now() - startTime }, "Problem not found");
    }
    return problem;
  } catch (error) {
    log.error(
      { id, durationMs: Date.now() - startTime, error },
      "Failed to fetch problem"
    );
    throw error;
  }
};

export const getCachedProblem = cache((id: string) =>
  unstable_cache(
    async () => {
      const startTime = Date.now();
      log.debug(
        { id },
        "Calling getProblemCached (expect cache hit if warmed)"
      );
      try {
        const result = await getProblem(id);
        log.info(
          { id, durationMs: Date.now() - startTime },
          "getProblemCached finished"
        );
        return result;
      } catch (error) {
        log.error(
          { id, durationMs: Date.now() - startTime, error },
          "getProblemCached failed"
        );
        throw error;
      }
    },
    ["getProblem", id],
    {
      tags: [`problem-${id}`],
    }
  )()
);
