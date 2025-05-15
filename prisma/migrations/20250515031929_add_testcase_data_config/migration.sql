-- CreateTable
CREATE TABLE "TestcaseDataConfig" (
    "id" TEXT NOT NULL,
    "testcaseDataId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "length" INTEGER,
    "pattern" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestcaseDataConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestcaseDataConfig_testcaseDataId_key" ON "TestcaseDataConfig"("testcaseDataId");

-- AddForeignKey
ALTER TABLE "TestcaseDataConfig" ADD CONSTRAINT "TestcaseDataConfig_testcaseDataId_fkey" FOREIGN KEY ("testcaseDataId") REFERENCES "TestcaseData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
