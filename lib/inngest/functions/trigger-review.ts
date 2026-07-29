import { inngest } from '@/lib/inngest/client'
import crypto from 'crypto'

export async function triggerPrReview(
    pullRequestId: string,
    featureRequestId: string | null,
  deliveryId = 'manual-' + crypto.randomUUID(),
) {
    await inngest.send({
        id: deliveryId,
        name: 'github/pr.received',
        data: { pullRequestId, featureRequestId, deliveryId },
    })
}