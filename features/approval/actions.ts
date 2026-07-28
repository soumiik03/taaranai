'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'


export async function getApprovalDetails(featureId: string) {
  const featureRequest = await prisma.featureRequest.findUnique({
    where: { id: featureId },
    include: {
      organization: true,
      prd: {
        include: {
          tasks: {
            orderBy: { order: 'asc' },
          },
        },
      },
      pullRequests: {
        orderBy: { updatedAt: 'desc' },
        include: {
          reviewRuns: {
            orderBy: { iteration: 'desc' },
            include: {
              issues: {
                orderBy: { createdAt: 'asc' },
              },
            },
          },
        },
      },
    },
  })

  if (!featureRequest) {
    return null
  }

  const latestPR = featureRequest.pullRequests[0] || null
  const latestReviewRun = latestPR?.reviewRuns[0] || null

  const outstandingNonBlockingIssues =
    latestReviewRun?.issues.filter(
      (issue) => issue.severity === 'non-blocking' && !issue.resolved
    ) || []

  return {
    featureRequest,
    prd: featureRequest.prd,
    tasks: featureRequest.prd?.tasks || [],
    pullRequest: latestPR,
    reviewRuns: latestPR?.reviewRuns || [],
    latestReviewRun,
    outstandingNonBlockingIssues,
  }
}

export async function approveFeature({
  featureId,
  pullRequestId,
  notes,
}: {
  featureId: string
  pullRequestId: string
  notes?: string
}) {
  const session = await getSession()
  const currentUser = session?.user

  const approverName = currentUser?.name || currentUser?.email || 'Human Reviewer'
  const approverId = currentUser?.id || 'unknown'
  const now = new Date()

  // 1. Update Pull Request status to SHIPPED and log approver metadata
  await prisma.pullRequest.update({
    where: { id: pullRequestId },
    data: {
      status: 'SHIPPED',
      approvedByUserId: approverId,
      approvedByName: approverName,
      approvedAt: now,
      approvalNotes: notes || null,
      shippedAt: now,
    },
  })

  // 2. Update Feature Request status to SHIPPED
  await prisma.featureRequest.update({
    where: { id: featureId },
    data: {
      status: 'SHIPPED',
    },
  })

  revalidatePath(`/dashboard/approval/${featureId}`)
  revalidatePath(`/dashboard/feature-requests/${featureId}`)
  revalidatePath('/dashboard/shipped')
  revalidatePath('/dashboard/pull-requests')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function rejectFeature({
  featureId,
  pullRequestId,
  notes,
}: {
  featureId: string
  pullRequestId: string
  notes: string
}) {
  const session = await getSession()
  const currentUser = session?.user
  const reviewerName = currentUser?.name || currentUser?.email || 'Human Reviewer'

  // 1. Fetch existing review runs to increment iteration count
  const existingRuns = await prisma.reviewRun.findMany({
    where: { pullRequestId },
  })
  const iteration = existingRuns.length + 1

  const pr = await prisma.pullRequest.findUniqueOrThrow({
    where: { id: pullRequestId },
  })

  // 2. Create new ReviewRun containing the human reviewer's blocking feedback
  await prisma.reviewRun.create({
    data: {
      pullRequestId,
      iteration,
      status: 'FIX_NEEDED',
      commitSha: pr.headSha,
      issues: {
        create: [
          {
            severity: 'blocking',
            title: `Human Reviewer Feedback (${reviewerName})`,
            body: notes,
            file: 'Human Review',
            line: null,
            resolved: false,
          },
        ],
      },
    },
  })

  // 3. Set Pull Request status to FIX_NEEDED
  await prisma.pullRequest.update({
    where: { id: pullRequestId },
    data: {
      status: 'FIX_NEEDED',
    },
  })

  revalidatePath(`/dashboard/approval/${featureId}`)
  revalidatePath(`/dashboard/feature-requests/${featureId}`)
  revalidatePath('/dashboard/review-history/' + pullRequestId)
  revalidatePath('/dashboard/pull-requests')
  revalidatePath('/dashboard')

  return { success: true }
}
