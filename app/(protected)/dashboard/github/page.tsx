import { getActiveOrganization } from '@/lib/session'
import { GithubConnectCard } from '@/features/github/components/github-connect-card'
import { ReposList } from '@/features/github/components/repos-list'

export default async function GithubPage() {
  const org = await getActiveOrganization()

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">GitHub</h1>
      {org?.githubInstallationId ? <ReposList /> : <GithubConnectCard />}
    </div>
  )
}