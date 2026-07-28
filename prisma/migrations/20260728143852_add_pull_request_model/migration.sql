-- CreateEnum
CREATE TYPE "PullRequestStatus" AS ENUM ('REVIEWING', 'FIX_NEEDED', 'READY_FOR_APPROVAL', 'SHIPPED');

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "htmlUrl" TEXT NOT NULL,
    "headSha" TEXT NOT NULL,
    "status" "PullRequestStatus" NOT NULL DEFAULT 'REVIEWING',
    "featureRequestId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PullRequest_organizationId_idx" ON "PullRequest"("organizationId");

-- CreateIndex
CREATE INDEX "PullRequest_featureRequestId_idx" ON "PullRequest"("featureRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_organizationId_repoFullName_number_key" ON "PullRequest"("organizationId", "repoFullName", "number");

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
