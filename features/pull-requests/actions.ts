'use server'

import { prisma } from '@/lib/db'
import { getActiveOrganization } from '@/lib/session'

export async function getPullRequests(statusFilter?: string) {
  const activeOrg = await getActiveOrganization()
  if (!activeOrg) return []

  const whereClause: any = {
    organizationId: activeOrg.id,
  }

  if (statusFilter && statusFilter !== 'ALL') {
    whereClause.status = statusFilter
  }

  const prs = await prisma.pullRequest.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' },
    include: {
      featureRequest: true,
      reviewRuns: {
        orderBy: { iteration: 'desc' },
        take: 1,
        include: {
          issues: true,
        },
      },
    },
  })

  return prs.map((pr) => {
    const latestRun = pr.reviewRuns[0]
    const blockingCount = latestRun?.issues.filter((i) => i.severity === 'blocking').length || 0
    const nonBlockingCount = latestRun?.issues.filter((i) => i.severity === 'non-blocking').length || 0

    return {
      id: pr.id,
      number: pr.number,
      repoFullName: pr.repoFullName,
      branchName: pr.branchName,
      title: pr.title,
      body: pr.body,
      htmlUrl: pr.htmlUrl,
      headSha: pr.headSha,
      status: pr.status,
      featureRequestId: pr.featureRequestId,
      featureRequestTitle: pr.featureRequest?.title || null,
      updatedAt: pr.updatedAt,
      latestIteration: latestRun?.iteration || 0,
      blockingCount,
      nonBlockingCount,
    }
  })
}

export async function getPullRequestDetail(id: string) {
  const pullRequest = await prisma.pullRequest.findUnique({
    where: { id },
    include: {
      organization: true,
      featureRequest: {
        include: {
          prd: {
            include: {
              tasks: true,
            },
          },
        },
      },
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
