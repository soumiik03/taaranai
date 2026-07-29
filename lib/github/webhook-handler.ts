// lib/github/webhook-handler.ts
import crypto from 'crypto'
import { env } from '@/lib/env'
import { prisma } from '@/lib/db'
import { triggerPrReview } from '@/lib/inngest/functions/trigger-review'

const DEBUG_WEBHOOKS = process.env.NODE_ENV !== 'production' || process.env.DEBUG_WEBHOOKS === 'true'

export function verifyWebhookSignature(
    rawBody: string,
    signatureHeader: string | null
): boolean {
    const logSignatureFailure = () => {
        console.error("GitHub webhook signature verification failed - check that GITHUB_WEBHOOK_SECRET in .env exactly matches the Webhook secret set on the GitHub App in GitHub's settings.")
    }

    if (!signatureHeader) {
        logSignatureFailure()
        return false
    }

    const secret = env.GITHUB_WEBHOOK_SECRET
    const normalizedSignature = signatureHeader.trim()

    if (DEBUG_WEBHOOKS) {
        const secretFingerprint = crypto.createHash('sha256').update(secret).digest('hex').slice(0, 12)
        console.info('[github webhook] signature diagnostics:', { secretLength: secret.length, secretFingerprint, signatureLength: normalizedSignature.length })
    }

    const hmac = crypto.createHmac('sha256', secret)
    const expected = 'sha256=' + hmac.update(rawBody).digest('hex')

    // timingSafeEqual prevents a timing attack from leaking the secret
    // byte-by-byte — a plain === comparison returns faster the moment it
    // hits the first mismatched character, which is a measurable signal.
    const expectedBuffer = Buffer.from(expected)
    const actualBuffer = Buffer.from(normalizedSignature)

    if (expectedBuffer.length !== actualBuffer.length) {
        logSignatureFailure()
        return false
    }

    const valid = crypto.timingSafeEqual(expectedBuffer, actualBuffer)
    if (!valid) logSignatureFailure()
    return valid
}

const HANDLED_ACTIONS = ['opened', 'synchronize', 'reopened']
type PullRequestWebhookPayload = {
    action?: string
    installation?: { id?: string | number }
    repository?: { full_name?: string }
    pull_request?: {
        number: number
        title?: string
        body?: string | null
        html_url?: string
        head?: { ref?: string; sha?: string }
    }
}

export async function handlePullRequestEvent(payload: PullRequestWebhookPayload) {
    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] action:', payload.action)
    if (!payload.action || !HANDLED_ACTIONS.includes(payload.action)) {
        return { handled: false, reason: 'ignored action' }
    }

    const installationId = String(payload.installation?.id ?? '')
    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] installation id:', installationId)
    if (!installationId) {
        return { handled: false, reason: 'no installation id on payload' }
    }

    const org = await prisma.organization.findFirst({
        where: { githubInstallationId: installationId },
    })
    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] matching organization:', org ? org.id : 'not found')
    if (!org) {
        return { handled: false, reason: 'no workspace connected to this installation' }
    }

    const pr = payload.pull_request
    if (!pr || !payload.repository?.full_name) {
        return { handled: false, reason: 'invalid pull request payload' }
    }

    const featureRequestId = await findLinkedFeatureRequest(
        org.id,
        pr.head?.ref || '',
        pr.body || '',
        pr.title || ''
    )

    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] before PullRequest upsert:', { organizationId: org.id, repoFullName: payload.repository.full_name, number: pr.number })
    const saved = await prisma.pullRequest.upsert({
        where: {
            organizationId_repoFullName_number: {
                organizationId: org.id,
                repoFullName: payload.repository.full_name,
                number: pr.number,
            },
        },
        create: {
            organizationId: org.id,
            repoFullName: payload.repository.full_name,
            number: pr.number,
            branchName: pr.head?.ref || '',
            title: pr.title || '',
            body: pr.body || null,
            htmlUrl: pr.html_url || '',
            headSha: pr.head?.sha || '',
            featureRequestId,
            status: 'REVIEWING',
        },
        update: {
            title: pr.title || '',
            body: pr.body || null,
            headSha: pr.head?.sha || '',
            branchName: pr.head?.ref || '',
            htmlUrl: pr.html_url || '',
            featureRequestId: featureRequestId ?? undefined,
            // A new push (synchronize) means whatever the last review said is
            // stale — reset to REVIEWING so Chapter 13's pipeline runs fresh.
            status: 'REVIEWING',
        },
    })
    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] after PullRequest upsert:', saved.id)

    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] before triggerPrReview:', saved.id)
    await triggerPrReview(saved.id, saved.featureRequestId)
    if (DEBUG_WEBHOOKS) console.info('[github webhook handler] after triggerPrReview:', saved.id)

    return { handled: true, pullRequestId: saved.id, featureRequestId: saved.featureRequestId }
}

// Matching a PR back to a feature request: try exact CUID match first,
// then token/keyword overlap between PR title/branch/body and FR title/description,
// and finally fall back to the single active open feature request with an approved PRD if present.
export async function findLinkedFeatureRequest(
    organizationId: string,
    branchName: string,
    prBody: string | null,
    prTitle: string = ''
): Promise<string | null> {
    const openRequests = await prisma.featureRequest.findMany({
        where: { organizationId, status: { in: ['READY', 'CLARIFYING', 'PENDING'] } },
        select: {
            id: true,
            title: true,
            description: true,
            prd: {
                select: {
                    id: true,
                    status: true,
                    tasks: { select: { id: true } },
                },
            },
        },
    })

    if (openRequests.length === 0) return null

    // 1. Exact CUID match in branch, PR title, or PR body
    for (const fr of openRequests) {
        if (branchName.includes(fr.id) || prBody?.includes(fr.id) || prTitle.includes(fr.id)) {
            return fr.id
        }
    }

    // 2. Keyword overlap matching
    const prText = `${prTitle} ${branchName} ${prBody || ''}`.toLowerCase()
    const stopWords = new Set(['feature', 'request', 'update', 'stuff', 'some', 'the', 'and', 'for', 'with', 'this', 'that', 'from', 'into', 'main', 'branch', 'pr'])
    const prWords = new Set(
        prText
            .split(/[^a-z0-9]+/)
            .filter((w) => w.length >= 2 && !stopWords.has(w))
    )

    let bestMatchId: string | null = null
    let maxMatchCount = 0

    for (const fr of openRequests) {
        const frText = `${fr.title} ${fr.description}`.toLowerCase()
        const frWords = frText
            .split(/[^a-z0-9]+/)
            .filter((w) => w.length >= 2 && !stopWords.has(w))

        const matches = frWords.filter((w) => prWords.has(w)).length
        if (matches > maxMatchCount) {
            maxMatchCount = matches
            bestMatchId = fr.id
        }
    }

    if (bestMatchId && maxMatchCount >= 1) {
        return bestMatchId
    }

    // 3. Fallback: If there is a single feature request with an approved PRD containing tasks, link to it.
    const validPrdRequests = openRequests.filter(
        (fr) => fr.prd && fr.prd.status === 'APPROVED' && fr.prd.tasks.length > 0
    )
    if (validPrdRequests.length === 1) {
        return validPrdRequests[0].id
    }

    return null
}