import { getServerSession } from '@/features/auth/actions'
import { SIGN_IN_PATH } from '@/features/auth/utils'
import { getActiveOrganization } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect(SIGN_IN_PATH)
  }

  const activeOrg = await getActiveOrganization()

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  if (memberships.length === 0 || !activeOrg) {
    redirect('/create-workspace')
  }

  const organizations = memberships.map((m) => m.organization)

  const activeAiRequest = await prisma.featureRequest.findFirst({
    where: {
      organizationId: activeOrg.id,
      OR: [
        { status: 'PENDING' },
        {
          status: 'CLARIFYING',
          clarificationQuestions: {
            none: {
              status: 'PENDING',
            },
          },
        },
      ],
    },
  })

  const isAiWorking = Boolean(activeAiRequest)

  return (
    <DashboardShell
      organizations={organizations}
      activeOrgId={activeOrg.id}
      user={session.user}
      isAiWorking={isAiWorking}
    >
      {children}
    </DashboardShell>
  )
}