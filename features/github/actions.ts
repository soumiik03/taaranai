'use server'

import { githubApp } from '@/lib/github/app-client'
import { getActiveOrganization } from '@/lib/session'

export type ConnectedRepo = {
  id: number
  name: string
  fullName: string
  private: boolean
}

export async function getConnectedRepos(): Promise<{
  connected: boolean
  repos: ConnectedRepo[]
}> {
  const org = await getActiveOrganization()
  if (!org?.githubInstallationId) return { connected: false, repos: [] }

  try {
    const octokit = await githubApp.getInstallationOctokit(
      Number(org.githubInstallationId)
    )

    const { data } = await octokit.request('GET /installation/repositories')

    return {
      connected: true,
      repos: data.repositories.map(
        (r: { id: number; name: string; full_name: string; private: boolean }) => ({
          id: r.id,
          name: r.name,
          fullName: r.full_name,
          private: r.private,
        })
      ),
    }
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return { connected: false, repos: [] }
  }
}