'use server'

import { prisma } from '@/lib/db'

export interface BlockingIssue {
  id: string
  title: string
  body: string
  file: string
  line: number | null
  severity: string
  resolved: boolean
}

export interface FixNeededState {
  pullRequestId: string
  pullRequestNumber: number
  pullRequestTitle: string
  htmlUrl: string
  headSha: string
  iteration: number
  blockingIssues: BlockingIssue[]
}

/**
 * Gets the latest Fix Needed details for a feature request if any linked PR is in FIX_NEEDED status.
 */
export async function getLatestFixNeededForFeatureRequest(
  featureRequestId: string
): Promise<FixNeededState | null> {
  const pullRequest = await prisma.pullRequest.findFirst({
    where: {
      featureRequestId,
      status: 'FIX_NEEDED',
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      reviewRuns: {
        orderBy: { iteration: 'desc' },
        take: 1,
        include: {
          issues: {
            where: { severity: 'blocking' },
          },
        },
      },
    },
  })

  if (!pullRequest || pullRequest.reviewRuns.length === 0) {
    return null
  }

  const latestRun = pullRequest.reviewRuns[0]

  return {
    pullRequestId: pullRequest.id,
    pullRequestNumber: pullRequest.number,
    pullRequestTitle: pullRequest.title,
    htmlUrl: pullRequest.htmlUrl,
    headSha: pullRequest.headSha,
    iteration: latestRun.iteration,
    blockingIssues: latestRun.issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      body: issue.body,
      file: issue.file,
      line: issue.line,
      severity: issue.severity,
      resolved: issue.resolved,
    })),
  }
}

/**
 * Retrieves the full review history for a given Pull Request.
 */
export async function getReviewHistory(pullRequestId: string) {
  const pullRequest = await prisma.pullRequest.findUnique({
    where: { id: pullRequestId },
    include: {
      featureRequest: true,
      organization: true,
      reviewRuns: {
        orderBy: { iteration: 'desc' },
        include: {
          issues: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  })

  if (!pullRequest) {
    return null
  }

  return pullRequest
}
