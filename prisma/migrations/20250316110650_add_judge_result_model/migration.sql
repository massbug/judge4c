-- CreateTable
CREATE TABLE "JudgeResult" (
    "id" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "exitCode" "ExitCode" NOT NULL,
    "executionTime" INTEGER,
    "memoryUsage" INTEGER,

    CONSTRAINT "JudgeResult_pkey" PRIMARY KEY ("id")
);
