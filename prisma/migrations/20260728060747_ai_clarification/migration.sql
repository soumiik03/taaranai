-- CreateEnum
CREATE TYPE "ClarificationStatus" AS ENUM ('PENDING', 'ANSWERED');

-- CreateTable
CREATE TABLE "ClarificationQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "status" "ClarificationStatus" NOT NULL DEFAULT 'PENDING',
    "featureRequestId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClarificationQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClarificationQuestion_featureRequestId_idx" ON "ClarificationQuestion"("featureRequestId");

-- CreateIndex
CREATE INDEX "ClarificationQuestion_organizationId_idx" ON "ClarificationQuestion"("organizationId");

-- AddForeignKey
ALTER TABLE "ClarificationQuestion" ADD CONSTRAINT "ClarificationQuestion_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClarificationQuestion" ADD CONSTRAINT "ClarificationQuestion_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
