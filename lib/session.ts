// lib/session.ts
import { headers, cookies } from 'next/headers'
import { auth } from './auth'
import { prisma } from './db'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getActiveOrganization() {
  const session = await getSession()
  if (!session) return null

  const cookieStore = await cookies()
  const activeOrgId = cookieStore.get('active_org_id')?.value

  const memberships = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  if (memberships.length === 0) return null

  const active = memberships.find((m) => m.organizationId === activeOrgId)
  return active?.organization ?? memberships[0].organization
}