import { getActiveOrganization } from '@/lib/session'
import { OverviewContent } from '@/features/dashboard/components/overview-content'
import { prisma } from '@/lib/db'
import { StatusType } from '@/features/dashboard/lib/status-styles'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const activeOrg = await getActiveOrganization()

  if (!activeOrg) return null

  const [totalRequests, pendingRequests, readyRequests, projectsCount, recentRequests] = await Promise.all([
    prisma.featureRequest.count({ where: { organizationId: activeOrg.id } }),
    prisma.featureRequest.count({ where: { organizationId: activeOrg.id, status: 'PENDING' } }),
    prisma.featureRequest.count({ where: { organizationId: activeOrg.id, status: 'READY' } }),
    prisma.project.count({ where: { organizationId: activeOrg.id } }),
    prisma.featureRequest.findMany({
      where: { organizationId: activeOrg.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const metrics = {
    totalRequests,
    pendingRequests,
    readyRequests,
    projectsCount,
  }

  const recentActivities = recentRequests.map(req => ({
    id: req.id,
    title: req.title,
    type: 'Feature Request',
    status: req.status as StatusType,
    timestamp: formatDistanceToNow(req.createdAt, { addSuffix: true }),
    author: 'System', // Since we don't have author on FeatureRequest yet
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