import { getSession, getActiveOrganization } from '@/lib/session'
import { prisma } from '@/lib/db'
import { WorkspaceSwitcher } from '@/features/workspace/components/workspace-switcher'
import { redirect } from 'next/navigation'
import { SIGN_IN_PATH } from '@/features/auth/utils'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect(SIGN_IN_PATH)
  }

  const org = await getActiveOrganization()

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  if (memberships.length === 0 || !org) {
    redirect('/create-workspace')
  }

  return (
    <div className="p-8 space-y-4">
      <div className="w-64">
        <WorkspaceSwitcher
          organizations={memberships.map((m) => m.organization)}
          activeOrgId={org.id}
        />
      </div>
      <p>Welcome to {org.name}</p>
    </div>
  )
}