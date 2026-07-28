import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/db'
import { env } from '@/lib/env'
import { githubApp } from '@/lib/github/app-client'
import { chunkPullRequestFiles } from '@/lib/github/chunk-code'
import { fetchPullRequestFiles } from '@/lib/github/pr-files'
import { postReviewComments } from '@/lib/github/pr-comment'
import { reviewDiffChunk, type GeneratedReviewIssue } from './generate-review'

export const reviewPRFunction = inngest.createFunction(
  { id: 'review-pull-request', triggers: [{ event: 'github/pr.received' }] },
  async ({ event, step }) => {
    const context = await step.run('fetch-pr-prd-and-org', async () => {
      const pullRequest = await prisma.pullRequest.findUniqueOrThrow({
        where: { id: event.data.pullRequestId },
        include: { organization: true, featureRequest: { include: { prd: true } } },
      })
      if (!pullRequest.featureRequest?.prd) throw new Error('Cannot review pull request without a linked PRD')
      if (!pullRequest.organization.githubInstallationId) throw new Error('Cannot review pull request without a GitHub installation')
      return {
        pullRequest,
        prd: { ...pullRequest.featureRequest.prd, featureRequest: { title: pullRequest.featureRequest.title, description: pullRequest.featureRequest.description } },
        installationId: pullRequest.organization.githubInstallationId,
      }
    })

    const files = await step.run('fetch-pr-diff', async () => fetchPullRequestFiles(githubApp, context.installationId, context.pullRequest.repoFullName, context.pullRequest.number))
    const chunks = await step.run('chunk-pr-diff', async () => chunkPullRequestFiles(files, 100))
    const issues = await step.run('review-diff-chunks', async () => {
      const allIssues: GeneratedReviewIssue[] = []
      for (const chunk of chunks) allIssues.push(...(await reviewDiffChunk(context.prd, chunk)))
      return allIssues
    })

    await step.run('post-github-comments', async () => postReviewComments({
      githubApp, installationId: context.installationId, repoFullName: context.pullRequest.repoFullName,
      pullNumber: context.pullRequest.number, headSha: context.pullRequest.headSha, issues, chunks,
    }))

    const status = issues.some((issue) => issue.severity === 'blocking') ? 'FIX_NEEDED' : 'READY_FOR_APPROVAL'
    await step.run('update-pull-request-status', async () => prisma.pullRequest.update({ where: { id: context.pullRequest.id }, data: { status } }))
    return { pullRequestId: context.pullRequest.id, chunksReviewed: chunks.length, issuesFound: issues.length, status, model: env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'unconfigured' }
  }
)
