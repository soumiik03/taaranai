-- AlterEnum
ALTER TYPE "FeatureRequestStatus" ADD VALUE 'SHIPPED';

-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "approvalNotes" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedByName" TEXT,
ADD COLUMN     "approvedByUserId" TEXT,
ADD COLUMN     "shippedAt" TIMESTAMP(3);
