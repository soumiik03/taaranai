-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'in_progress', 'done');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "PRD" ADD COLUMN     "planApproved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'todo',
    "priority" "TaskPriority" NOT NULL DEFAULT 'medium',
    "order" INTEGER NOT NULL DEFAULT 0,
    "prdId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_prdId_idx" ON "Task"("prdId");

-- CreateIndex
CREATE INDEX "Task_prdId_status_idx" ON "Task"("prdId", "status");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_prdId_fkey" FOREIGN KEY ("prdId") REFERENCES "PRD"("id") ON DELETE CASCADE ON UPDATE CASCADE;
