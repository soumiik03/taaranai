-- CreateEnum
CREATE TYPE "FeatureSourceType" AS ENUM ('EMAIL', 'TICKET', 'CALL', 'MANUAL');

-- CreateEnum
CREATE TYPE "FeatureRequestStatus" AS ENUM ('PENDING', 'CLARIFYING', 'READY', 'REJECTED');

-- CreateTable
CREATE TABLE "FeatureRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceType" "FeatureSourceType" NOT NULL DEFAULT 'MANUAL',
    "status" "FeatureRequestStatus" NOT NULL DEFAULT 'PENDING',
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeatureRequest_organizationId_idx" ON "FeatureRequest"("organizationId");

-- CreateIndex
CREATE INDEX "FeatureRequest_projectId_idx" ON "FeatureRequest"("projectId");

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
