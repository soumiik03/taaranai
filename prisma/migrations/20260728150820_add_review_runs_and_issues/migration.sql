-- CreateTable
CREATE TABLE "ReviewRun" (
    "id" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL DEFAULT 1,
    "status" "PullRequestStatus" NOT NULL,
    "commitSha" TEXT NOT NULL,
    "pullRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewIssue" (
    "id" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "line" INTEGER,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "reviewRunId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewRun_pullRequestId_idx" ON "ReviewRun"("pullRequestId");

-- CreateIndex
CREATE INDEX "ReviewIssue_reviewRunId_idx" ON "ReviewIssue"("reviewRunId");

-- AddForeignKey
ALTER TABLE "ReviewRun" ADD CONSTRAINT "ReviewRun_pullRequestId_fkey" FOREIGN KEY ("pullRequestId") REFERENCES "PullRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewIssue" ADD CONSTRAINT "ReviewIssue_reviewRunId_fkey" FOREIGN KEY ("reviewRunId") REFERENCES "ReviewRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
