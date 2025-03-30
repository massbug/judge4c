/*
  Warnings:

  - A unique constraint covering the columns `[displayId]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayId` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "displayId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_displayId_key" ON "Problem"("displayId");
