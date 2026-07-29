import { NextResponse } from 'next/server'
import { getActiveOrganization } from '@/lib/session'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const organization = await getActiveOrganization()
  if (!organization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const featureRequest = await prisma.featureRequest.findFirst({
    where: { id, organizationId: organization.id },
    select: {
      status: true,
      prd: { select: { id: true } },
      clarificationQuestions: {
        where: { status: 'PENDING' },
        select: { id: true },
      },
    },
  })

  if (!featureRequest) {
    return NextResponse.json({ error: 'Feature request not found' }, { status: 404 })
  }

  return NextResponse.json(
    {
      status: featureRequest.status,
      hasPendingQuestions: featureRequest.clarificationQuestions.length > 0,
      prdId: featureRequest.prd?.id ?? null,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  )
}