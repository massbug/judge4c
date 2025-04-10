/*
  Warnings:

  - You are about to drop the column `memoryLimit` on the `DockerConfig` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimit` on the `DockerConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DockerConfig" DROP COLUMN "memoryLimit",
DROP COLUMN "timeLimit";

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "memoryLimit" INTEGER NOT NULL DEFAULT 128,
ADD COLUMN     "timeLimit" INTEGER NOT NULL DEFAULT 1000;
