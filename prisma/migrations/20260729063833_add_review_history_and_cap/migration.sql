-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "reviewRunCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ReviewRun" ADD COLUMN     "taskVerdicts" JSONB;
