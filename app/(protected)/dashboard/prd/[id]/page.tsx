// app/(protected)/dashboard/prd/[id]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getActiveOrganization } from '@/lib/session'
import { PrdEditor } from '@/features/prd/components/prd-editor'

export default async function PrdPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const org = await getActiveOrganization()
    if (!org) notFound()

    const prd = await prisma.pRD.findFirst({
        where: { id, organizationId: org.id },
        include: {
            featureRequest: {
                select: { title: true, description: true },
            },
        },
    })
    if (!prd) notFound()

    return (
        <div className="p-8">
            <PrdEditor prd={prd as unknown as Parameters<typeof PrdEditor>[0]['prd']} />
        </div>
    )
}
