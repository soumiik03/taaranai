// app/api/github/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, handlePullRequestEvent } from '@/lib/github/webhook-handler'

export async function POST(request: NextRequest) {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const eventType = request.headers.get('x-github-event')

    if (!verifyWebhookSignature(rawBody, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (eventType !== 'pull_request') {
        return NextResponse.json({ ignored: true, reason: 'not a pull_request event' })
    }

    const payload = JSON.parse(rawBody)
    const result = await handlePullRequestEvent(payload)

    return NextResponse.json(result)
}