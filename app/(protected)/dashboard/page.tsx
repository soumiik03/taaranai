import { getActiveOrganization } from '@/lib/session'
import { OverviewContent } from '@/features/dashboard/components/overview-content'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const activeOrg = await getActiveOrganization()

  return <OverviewContent orgName={activeOrg?.name ?? 'Workspace'} />
}