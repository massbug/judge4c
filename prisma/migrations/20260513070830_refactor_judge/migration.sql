/*
  Warnings:

  - You are about to drop the `TestcaseResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JudgeStatus" AS ENUM ('COMPILING', 'COMPILATION_ERROR', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'SYSTEM_ERROR');

-- CreateEnum
CREATE TYPE "JudgeRunStatus" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'SYSTEM_ERROR');

-- DropForeignKey
ALTER TABLE "TestcaseResult" DROP CONSTRAINT "TestcaseResult_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "TestcaseResult" DROP CONSTRAINT "TestcaseResult_testcaseId_fkey";

-- DropTable
DROP TABLE "TestcaseResult";

-- CreateTable
CREATE TABLE "Judge" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "status" "JudgeStatus" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "compileOutput" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JudgeRun" (
    "id" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,
    "status" "JudgeRunStatus" NOT NULL,
    "timeUsage" INTEGER,
    "memoryUsage" INTEGER,
    "stdin" TEXT,
    "stdout" TEXT,
    "stderr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JudgeRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Judge_submissionId_key" ON "Judge"("submissionId");

-- CreateIndex
CREATE INDEX "JudgeRun_judgeId_idx" ON "JudgeRun"("judgeId");

-- CreateIndex
CREATE INDEX "JudgeRun_testcaseId_idx" ON "JudgeRun"("testcaseId");

-- AddForeignKey
ALTER TABLE "Judge" ADD CONSTRAINT "Judge_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeRun" ADD CONSTRAINT "JudgeRun_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeRun" ADD CONSTRAINT "JudgeRun_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
