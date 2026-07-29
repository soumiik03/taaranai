// app/api/github/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, handlePullRequestEvent } from '@/lib/github/webhook-handler'

export const runtime = 'nodejs'

const DEBUG_WEBHOOKS = process.env.NODE_ENV !== 'production' || process.env.DEBUG_WEBHOOKS === 'true'

export async function POST(request: NextRequest) {
    if (DEBUG_WEBHOOKS) console.info('[github webhook] request received')
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const eventType = request.headers.get('x-github-event')
    if (DEBUG_WEBHOOKS) console.info('[github webhook] event type:', eventType)

    const signatureValid = verifyWebhookSignature(rawBody, signature)
    if (DEBUG_WEBHOOKS) console.info('[github webhook] signature verification:', signatureValid ? 'pass' : 'fail')
    if (!signatureValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (eventType !== 'pull_request') {
        return NextResponse.json({ ignored: true, reason: 'not a pull_request event' })
    }

    let payload: Parameters<typeof handlePullRequestEvent>[0]
    try {
        payload = JSON.parse(rawBody) as Parameters<typeof handlePullRequestEvent>[0]
    } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }
    if (DEBUG_WEBHOOKS) {
        console.info('[github webhook] parsed action:', payload.action)
        console.info('[github webhook] payload installation id:', payload.installation?.id)
    }
    try {
        const result = await handlePullRequestEvent(payload)
        return NextResponse.json(result)
    } catch (error) {
        console.error('[github webhook] processing failed:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
