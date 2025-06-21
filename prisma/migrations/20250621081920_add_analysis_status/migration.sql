-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "CodeAnalysis" ADD COLUMN     "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING';
