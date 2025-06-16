/*
  Warnings:

  - You are about to drop the column `trim` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "trim",
ADD COLUMN     "isTrim" BOOLEAN NOT NULL DEFAULT false;
