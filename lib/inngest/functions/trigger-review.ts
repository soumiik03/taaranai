import { inngest } from '@/lib/inngest/client'

export async function triggerPrReview(
    pullRequestId: string,
    featureRequestId: string | null
) {
    await inngest.send({
        name: 'github/pr.received',
        data: { pullRequestId, featureRequestId },
    })
}