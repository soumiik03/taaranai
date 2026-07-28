import type { App } from '@octokit/app'
import { parseRepositoryName } from './pr-files'

export type ReviewIssue = {
  severity: 'blocking' | 'non-blocking'
  title: string
  body: string
  file: string
  line: number | null
}

export async function postReviewComments({
  githubApp, installationId, repoFullName, pullNumber, headSha, issues, chunks,
}: {
  githubApp: App
  installationId: string
  repoFullName: string
  pullNumber: number
  headSha: string
  issues: ReviewIssue[]
  chunks: { filename: string; changedLines: number[] }[]
}) {
  const octokit = await githubApp.getInstallationOctokit(Number(installationId))
  const { owner, repo } = parseRepositoryName(repoFullName)
  let posted = 0

  for (const issue of issues) {
    const body = `**${issue.severity === 'blocking' ? 'Blocking' : 'Non-blocking'}: ${issue.title}**\n\n${issue.body}`
    const canCommentInline = Boolean(
      issue.line !== null &&
      chunks.some((candidate) => candidate.filename === issue.file && candidate.changedLines.includes(issue.line as number))
    )

    if (canCommentInline) {
      try {
        await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
          owner, repo, pull_number: pullNumber, body, commit_id: headSha, path: issue.file,
          line: issue.line as number, side: 'RIGHT',
        })
        posted += 1
        continue
      } catch (error) {
        console.warn('Inline GitHub review comment failed; using general comment', error)
      }
    }

    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner, repo, issue_number: pullNumber,
      body: `${body}\n\n_File: ${issue.file}${issue.line ? `, line ${issue.line}` : ''}_`,
    })
    posted += 1
  }
  return { posted }
}
