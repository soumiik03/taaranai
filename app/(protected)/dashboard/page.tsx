import { getActiveOrganization } from '@/lib/session'
import { OverviewContent } from '@/features/dashboard/components/overview-content'
import { prisma } from '@/lib/db'
import { StatusType } from '@/features/dashboard/lib/status-styles'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const activeOrg = await getActiveOrganization()

  if (!activeOrg) return null

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalRequests,
    prdsThisMonth,
    activeReviews,
    featuresShipped,
    blockingIssues,
    recentRequests,
  ] = await Promise.all([
    prisma.featureRequest.count({ where: { organizationId: activeOrg.id } }),
    prisma.pRD.count({
      where: {
        organizationId: activeOrg.id,
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.pullRequest.count({
      where: {
        organizationId: activeOrg.id,
        status: { in: ['REVIEWING', 'FIX_NEEDED'] },
      },
    }),
    prisma.pullRequest.count({
      where: {
        organizationId: activeOrg.id,
        status: 'SHIPPED',
      },
    }),
    prisma.reviewIssue.count({
      where: {
        reviewRun: {
          pullRequest: {
            organizationId: activeOrg.id,
          },
        },
        severity: 'blocking',
        resolved: false,
      },
    }),
    prisma.featureRequest.findMany({
      where: { organizationId: activeOrg.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const metrics = {
    totalRequests,
    prdsThisMonth,
    activeReviews,
    featuresShipped,
    blockingIssues,
  }

  const recentActivities = recentRequests.map((req) => ({
    id: req.id,
    title: req.title,
    type: 'Feature Request',
    status: req.status as StatusType,
    timestamp: formatDistanceToNow(req.createdAt, { addSuffix: true }),
    author: 'System',
  }))

  return (
    <OverviewContent
      orgName={activeOrg.name}
      hasGithubConnection={!!activeOrg.githubInstallationId}
      metrics={metrics}
      recentActivities={recentActivities}
    />
  )
}