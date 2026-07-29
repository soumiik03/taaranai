import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/db'
import { env } from '@/lib/env'
import { githubApp } from '@/lib/github/app-client'
import { chunkPullRequestFiles } from '@/lib/github/chunk-code'
import { fetchPullRequestFiles } from '@/lib/github/pr-files'
import { postReviewComments, type ReviewIssue, type ReviewTask, type TaskVerdict } from '@/lib/github/pr-comment'
import {
  reviewDiffChunk,
  type GeneratedReviewIssue,
  type GeneratedTaskVerdict,
} from './generate-review'

export const reviewPRFunction = inngest.createFunction(
  { id: 'review-pull-request', triggers: [{ event: 'github/pr.received' }], singleton: { key: 'event.data.pullRequestId', mode: 'cancel' } },
  async ({ event, step }) => {
    const context = await step.run('fetch-pr-tasks-and-org', async () => {
      let pullRequest = await prisma.pullRequest.findUniqueOrThrow({
        where: { id: event.data.pullRequestId },
        include: {
          organization: true,
          featureRequest: {
            include: {
              prd: {
                include: {
                  tasks: {
                    orderBy: { order: 'asc' },
                    take: 4,
                  },
                },
              },
            },
          },
        },
      })

      if (pullRequest.reviewRunCount >= 3) {
        return { limitReached: true as const }
      }

      // If PR has no linked feature request, attempt fallback linking to an approved PRD with tasks in the org
      if (!pullRequest.featureRequest) {
        const fallbackFr = await prisma.featureRequest.findFirst({
          where: {
            organizationId: pullRequest.organizationId,
            prd: {
              status: 'APPROVED',
              tasks: { some: {} },
            },
          },
          include: {
            prd: {
              include: {
                tasks: { orderBy: { order: 'asc' }, take: 4 },
              },
            },
          },
        })

        if (fallbackFr) {
          await prisma.pullRequest.update({
            where: { id: pullRequest.id },
            data: { featureRequestId: fallbackFr.id },
          })
          pullRequest = await prisma.pullRequest.findUniqueOrThrow({
            where: { id: event.data.pullRequestId },
            include: {
              organization: true,
              featureRequest: {
                include: {
                  prd: {
                    include: {
                      tasks: {
                        orderBy: { order: 'asc' },
                        take: 4,
                      },
                    },
                  },
                },
              },
            },
          })
        }
      }

      const previousRun = await prisma.reviewRun.findFirst({
        where: { pullRequestId: pullRequest.id },
        include: { issues: true },
        orderBy: { iteration: 'desc' },
      })
      const previousVerdicts = previousRun?.taskVerdicts as { taskId: string; status: string; reasoning: string }[] | undefined
      const previousIssues = previousRun?.issues
        .filter(i => !i.resolved && i.line !== null)
        .map(i => ({
          file: i.file,
          line: i.line as number,
          message: i.body,
          resolved: i.resolved,
        }))

      const prd = pullRequest.featureRequest?.prd
      if (!prd || prd.status !== 'APPROVED') {
        return { skipped: true as const, reason: 'Cannot review pull request without an approved PRD' }
      }

      if (prd.tasks.length === 0) {
        return { skipped: true as const, reason: 'Cannot review pull request because the approved plan has no tasks' }
      }

      if (!prd.planApproved) {
        await prisma.pRD.update({
          where: { id: prd.id },
          data: { planApproved: true },
        })
      }

      const tasks: ReviewTask[] = prd.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
      }))

      if (!pullRequest.organization.githubInstallationId) {
        return { skipped: true as const, reason: 'Cannot review pull request without a GitHub installation' }
      }

      return {
        pullRequest,
        tasks,
        installationId: pullRequest.organization.githubInstallationId,
        previousVerdicts,
        previousIssues,
      }
    })

    if ('limitReached' in context) {
      return { status: 'LIMIT_REACHED', reason: 'Automatic review limit exceeded.' }
    }
    if ('skipped' in context) {
      return { status: 'SKIPPED', reason: context.reason }
    }

    const files = await step.run('fetch-pr-diff', async () =>
      fetchPullRequestFiles(
        githubApp,
        context.installationId,
        context.pullRequest.repoFullName,
        context.pullRequest.number,
      ),
    )
    const chunks = await step.run('chunk-pr-diff', async () =>
      chunkPullRequestFiles(files, 100),
    )

    const review = await step.run('review-diff-chunks', async () => {
      const taskVerdictById = new Map<string, GeneratedTaskVerdict>(
        context.tasks.map((task) => [
          task.id,
          {
            taskId: task.id,
            status: 'NOT_ADDRESSED',
            reasoning: 'No implementation evidence was found in the reviewed diff.',
          },
        ]),
      )
      const issuesByKey = new Map<string, GeneratedReviewIssue>()

      for (const chunk of chunks) {
        const chunkReview = await reviewDiffChunk(context.tasks, chunk, context.pullRequest.reviewRunCount > 0, context.previousVerdicts, context.previousIssues)

        for (const verdict of chunkReview.taskVerdicts) {
          const existing = taskVerdictById.get(verdict.taskId)
          if (!existing || existing.status === 'NEEDS_FIX') continue

          if (verdict.status === 'NEEDS_FIX') {
            taskVerdictById.set(verdict.taskId, verdict)
          } else if (verdict.status === 'DONE') {
            taskVerdictById.set(verdict.taskId, verdict)
          } else if (existing.status === 'NOT_ADDRESSED') {
            taskVerdictById.set(verdict.taskId, verdict)
          }
        }

        for (const issue of chunkReview.issues) {
          const key = [
            issue.taskId,
            issue.file,
            issue.line,
            issue.severity,
            issue.message,
          ].join(':')
          issuesByKey.set(key, issue)
        }
      }

      const taskVerdicts = [...taskVerdictById.values()]
      const issues = [...issuesByKey.values()]
      const overallVerdict = taskVerdicts.some((verdict) => verdict.status !== 'DONE')
        ? 'NEEDS_FIX'
        : 'READY'

      return { taskVerdicts, issues, overallVerdict }
    })

    await step.run('post-github-review', async () =>
      postReviewComments({
        githubApp,
        installationId: context.installationId,
        repoFullName: context.pullRequest.repoFullName,
        pullNumber: context.pullRequest.number,
        headSha: context.pullRequest.headSha,
        tasks: context.tasks,
        taskVerdicts: review.taskVerdicts as TaskVerdict[],
        issues: review.issues as ReviewIssue[],
        isReReview: context.pullRequest.reviewRunCount > 0,
        isFinalReview: context.pullRequest.reviewRunCount === 2,
      }),
    )

    const status = review.overallVerdict === 'NEEDS_FIX'
      ? 'FIX_NEEDED'
      : 'READY_FOR_APPROVAL'

    await step.run('record-review-run', async () => {
      const existingRuns = await prisma.reviewRun.findMany({
        where: { pullRequestId: context.pullRequest.id },
        include: { issues: true },
        orderBy: { iteration: 'desc' },
      })

      const iteration = existingRuns.length + 1
      const taskTitleById = new Map(context.tasks.map((task) => [task.id, task.title]))
      const currentIssueKeys = new Set(
        review.issues.map((issue) => {
          const taskTitle = taskTitleById.get(issue.taskId) ?? issue.taskId
          return [
            issue.file,
            issue.line,
            'Task: ' + taskTitle + '\n\n' + issue.message,
          ].join(':')
        }),
      )

      if (existingRuns.length > 0) {
        const lastRun = existingRuns[0]
        for (const previousIssue of lastRun.issues) {
          const key = [previousIssue.file, previousIssue.line, previousIssue.body].join(':')
          if (!currentIssueKeys.has(key) && !previousIssue.resolved) {
            await prisma.reviewIssue.update({
              where: { id: previousIssue.id },
              data: { resolved: true },
            })
          }
        }
      }

      await prisma.reviewRun.create({
        data: {
          pullRequestId: context.pullRequest.id,
          iteration,
          status,
          commitSha: context.pullRequest.headSha,
          taskVerdicts: review.taskVerdicts,
          issues: {
            create: review.issues.map((issue) => {
              const taskTitle = taskTitleById.get(issue.taskId) ?? issue.taskId
              return {
                severity: issue.severity,
                title: taskTitle + ': ' + issue.message,
                body: 'Task: ' + taskTitle + '\n\n' + issue.message,
                file: issue.file,
                line: issue.line,
                resolved: false,
              }
            }),
          },
        },
      })

      await prisma.pullRequest.update({
        where: { id: context.pullRequest.id },
        data: { 
          status,
          reviewRunCount: { increment: 1 },
        },
      })
    })

    return {
      pullRequestId: context.pullRequest.id,
      chunksReviewed: chunks.length,
      tasksReviewed: context.tasks.length,
      issuesFound: review.issues.length,
      status,
      model: env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'unconfigured',
    }
  },
)