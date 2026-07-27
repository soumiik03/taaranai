import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getActiveOrganization } from '@/lib/session'

export async function GET(request: NextRequest) {
  const installationId = request.nextUrl.searchParams.get('installation_id')

  if (!installationId) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const org = await getActiveOrganization()
  if (!org) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: { githubInstallationId: installationId },
  })

  return NextResponse.redirect(new URL('/dashboard/github', request.url))
}