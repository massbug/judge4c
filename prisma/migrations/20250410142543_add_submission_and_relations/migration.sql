/*
  Warnings:

  - You are about to drop the `JudgeResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PD', 'QD', 'CP', 'CE', 'CS', 'RU', 'TLE', 'MLE', 'RE', 'AC', 'WA', 'SE');

-- DropTable
DROP TABLE "JudgeResult";

-- DropEnum
DROP TYPE "ExitCode";

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "language" "EditorLanguage" NOT NULL,
    "code" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "message" TEXT,
    "executionTime" INTEGER,
    "memoryUsage" INTEGER,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
