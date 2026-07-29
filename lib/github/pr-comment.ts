import type { App } from '@octokit/app'
import { parseRepositoryName } from './pr-files'

export type ReviewTask = {
  id: string
  title: string
  description: string
}

export type TaskVerdict = {
  taskId: string
  status: 'DONE' | 'NEEDS_FIX' | 'NOT_ADDRESSED'
  reasoning: string
}

export type ReviewIssue = {
  taskId: string
  severity: 'blocking' | 'non-blocking'
  file: string
  line: number
  message: string
}

function statusLabel(status: TaskVerdict['status']) {
  if (status === 'DONE') return 'Done'
  if (status === 'NEEDS_FIX') return 'Needs Fix'
  return 'Not Addressed'
}

export async function postReviewComments({
  githubApp,
  installationId,
  repoFullName,
  pullNumber,
  headSha,
  tasks,
  taskVerdicts,
  issues,
  isReReview,
  isFinalReview,
}: {
  githubApp: App
  installationId: string
  repoFullName: string
  pullNumber: number
  headSha: string
  tasks: ReviewTask[]
  taskVerdicts: TaskVerdict[]
  issues: ReviewIssue[]
  isReReview?: boolean
  isFinalReview?: boolean
}) {
  const octokit = await githubApp.getInstallationOctokit(Number(installationId))
  const { owner, repo } = parseRepositoryName(repoFullName)
  const verdictByTaskId = new Map(taskVerdicts.map((verdict) => [verdict.taskId, verdict]))
  const doneCount = taskVerdicts.filter((verdict) => verdict.status === 'DONE').length
  const needsFixCount = taskVerdicts.filter((verdict) => verdict.status === 'NEEDS_FIX').length
  const notAddressedCount = taskVerdicts.filter((verdict) => verdict.status === 'NOT_ADDRESSED').length

  const taskLines = tasks.map((task) => {
    const verdict = verdictByTaskId.get(task.id)
    return '- ' + task.title + ' → ' + statusLabel(verdict?.status ?? 'NOT_ADDRESSED')
  })

  const prefix = isReReview ? 'Re-review after latest push:\n\n' : ''
  const suffix = isFinalReview
    ? '\n\n**Note:** The automatic review limit (3 runs) has been reached for this PR. Further pushes will not be automatically reviewed and will require manual review.'
    : ''

  const issuesList = issues.length > 0 ? [
    '',
    '### Issues Found:',
    '',
    ...issues.map(issue => {
      const taskTitle = tasks.find((task) => task.id === issue.taskId)?.title ?? issue.taskId
      return `- **File:** \`${issue.file}\` (Line ${issue.line})\n  **Severity:** ${issue.severity === 'blocking' ? 'Blocking' : 'Non-blocking'}\n  **Task:** ${taskTitle}\n  **Message:** ${issue.message}`
    })
  ] : []

  const body = prefix + [
    'Reviewed against ' + tasks.length + ' tasks from the approved plan. ' +
      doneCount + ' complete, ' + needsFixCount + ' needs a fix, ' +
      notAddressedCount + ' not yet addressed.',
    '',
    ...taskLines,
    ...issuesList
  ].join('\n') + suffix

  const response = await octokit.request(
    'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
    {
      owner,
      repo,
      pull_number: pullNumber,
      commit_id: headSha,
      body,
      event: 'COMMENT',
      comments: [],
    },
  )

  return {
    reviewId: response.data.id,
    commentsPosted: issues.length,
  }
}