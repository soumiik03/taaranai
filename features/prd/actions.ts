'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getActiveOrganization } from '@/lib/session'
import { inngest } from '@/lib/inngest/client'

export async function getPrdByFeatureRequest(featureRequestId: string) {
    const org = await getActiveOrganization()
    if (!org) return null

    return prisma.pRD.findFirst({
        where: { featureRequestId, organizationId: org.id },
    })
}

export async function updatePrdSection(
    prdId: string,
    field:
        | 'problemStatement'
        | 'goals'
        | 'nonGoals'
        | 'userStories'
        | 'acceptanceCriteria'
        | 'edgeCases'
        | 'successMetrics',
    value: unknown
) {
    const org = await getActiveOrganization()
    if (!org) throw new Error('Not authenticated')

    const result = await prisma.pRD.updateMany({
        where: { id: prdId, organizationId: org.id },
        data: { [field]: value },
    })
    if (result.count === 0) throw new Error('PRD not found')

    revalidatePath(`/dashboard/prd/${prdId}`)
}

export async function getAllPrds() {
    const org = await getActiveOrganization()
    if (!org) return []

    return prisma.pRD.findMany({
        where: { organizationId: org.id },
        include: {
            featureRequest: {
                select: { title: true, description: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export async function deletePrd(prdId: string) {
    const org = await getActiveOrganization()
    if (!org) throw new Error('Not authenticated')

    const prd = await prisma.pRD.findFirst({
        where: { id: prdId, organizationId: org.id },
    })
    if (!prd) throw new Error('PRD not found')

    await prisma.pRD.delete({
        where: { id: prdId },
    })

    revalidatePath('/dashboard/prd')
}

export async function approvePrd(prdId: string) {
    const org = await getActiveOrganization()
    if (!org) throw new Error('Not authenticated')

    const prd = await prisma.pRD.findFirst({
        where: { id: prdId, organizationId: org.id },
    })
    if (!prd) throw new Error('PRD not found')

    await prisma.pRD.update({
        where: { id: prdId },
        data: { status: 'APPROVED' },
    })

    // Chapter 11 picks this up to generate tasks.
    await inngest.send({
        name: 'tasks/generate',
        data: { prdId },
    })

    revalidatePath(`/dashboard/prd/${prdId}`)
}