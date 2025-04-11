/*
  Warnings:

  - Added the required column `index` to the `TestcaseData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestcaseData" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TestcaseResult" (
    "id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "output" TEXT NOT NULL,
    "executionTime" INTEGER,
    "memoryUsage" INTEGER,
    "submissionId" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestcaseResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestcaseResult" ADD CONSTRAINT "TestcaseResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestcaseResult" ADD CONSTRAINT "TestcaseResult_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
