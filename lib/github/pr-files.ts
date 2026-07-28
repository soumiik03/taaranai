import type { App } from '@octokit/app'

export type PullRequestFile = {
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  patch: string | null
}

function splitRepository(fullName: string) {
  const [owner, repo, ...rest] = fullName.split('/')
  if (!owner || !repo || rest.length > 0) throw new Error(`Invalid GitHub repository name: ${fullName}`)
  return { owner, repo }
}

export async function fetchPullRequestFiles(
  githubApp: App,
  installationId: string,
  repoFullName: string,
  pullNumber: number
): Promise<PullRequestFile[]> {
  const octokit = await githubApp.getInstallationOctokit(Number(installationId))
  const { owner, repo } = splitRepository(repoFullName)
  const files: PullRequestFile[] = []

  for (let page = 1; ; page += 1) {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      { owner, repo, pull_number: pullNumber, per_page: 100, page }
    )
    const pageFiles = response.data as PullRequestFile[]
    files.push(...pageFiles)
    if (pageFiles.length < 100) break
  }

  return files
}

export function parseRepositoryName(repoFullName: string) {
  return splitRepository(repoFullName)
}
