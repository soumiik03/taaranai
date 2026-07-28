-- CreateEnum
CREATE TYPE "PRDStatus" AS ENUM ('DRAFT', 'APPROVED');

-- CreateTable
CREATE TABLE "PRD" (
    "id" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "goals" JSONB NOT NULL,
    "nonGoals" JSONB NOT NULL,
    "userStories" JSONB NOT NULL,
    "acceptanceCriteria" JSONB NOT NULL,
    "edgeCases" JSONB NOT NULL,
    "successMetrics" JSONB NOT NULL,
    "status" "PRDStatus" NOT NULL DEFAULT 'DRAFT',
    "featureRequestId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PRD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PRD_featureRequestId_key" ON "PRD"("featureRequestId");

-- CreateIndex
CREATE INDEX "PRD_organizationId_idx" ON "PRD"("organizationId");

-- AddForeignKey
ALTER TABLE "PRD" ADD CONSTRAINT "PRD_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRD" ADD CONSTRAINT "PRD_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
