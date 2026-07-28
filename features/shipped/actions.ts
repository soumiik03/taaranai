'use server'

import { prisma } from '@/lib/db'
import { getActiveOrganization } from '@/lib/session'

export interface ShippedFeatureItem {
  id: string
  title: string
  description: string
  approvedByName: string | null
  approvalNotes: string | null
  shippedAt: Date | null
  pullRequest: {
    id: string
    number: number
    repoFullName: string
    branchName: string
    htmlUrl: string
    headSha: string
  }
  timeline: {
    requestSubmitted: Date
    prdApproved: Date | null
    tasksCreated: Date | null
    prOpened: Date
    reviewsPassed: Date | null
    humanApproved: Date | null
  }
  taskCount: number
  iterationCount: number
}

export async function getShippedFeatures(): Promise<ShippedFeatureItem[]> {
  const activeOrg = await getActiveOrganization()
  if (!activeOrg) return []

  const shippedPRs = await prisma.pullRequest.findMany({
    where: {
      organizationId: activeOrg.id,
      status: 'SHIPPED',
    },
    orderBy: { updatedAt: 'desc' },
    include: {
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
      },
    },
  })

  return shippedPRs.map((pr) => {
    const fr = pr.featureRequest
    const prd = fr?.prd
    const tasks = prd?.tasks || []
    const latestRun = pr.reviewRuns[0]

    return {
      id: pr.id,
      title: fr?.title || pr.title,
      description: fr?.description || pr.body || 'No description provided.',
      approvedByName: pr.approvedByName,
      approvalNotes: pr.approvalNotes,
      shippedAt: pr.shippedAt || pr.updatedAt,
      pullRequest: {
        id: pr.id,
        number: pr.number,
        repoFullName: pr.repoFullName,
        branchName: pr.branchName,
        htmlUrl: pr.htmlUrl,
        headSha: pr.headSha,
      },
      timeline: {
        requestSubmitted: fr?.createdAt || pr.createdAt,
        prdApproved: prd?.updatedAt || null,
        tasksCreated: tasks.length > 0 ? tasks[0].createdAt : null,
        prOpened: pr.createdAt,
        reviewsPassed: latestRun?.createdAt || null,
        humanApproved: pr.approvedAt || pr.shippedAt || pr.updatedAt,
      },
      taskCount: tasks.length,
      iterationCount: pr.reviewRuns.length,
    }
  })
}
