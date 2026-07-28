// app/(protected)/dashboard/pull-requests/page.tsx
import { getPullRequests } from '@/features/pull-requests/actions'
import { PullRequestsList } from '@/features/pull-requests/components/pull-requests-list'
import { GitPullRequest } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PullRequestsPage() {
  const pullRequests = await getPullRequests()

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30">
            <GitPullRequest className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Pull Requests
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor real-time AI code reviews, blocking issues, and release readiness across all connected repositories.
        </p>
      </div>

      {/* PR List */}
      <PullRequestsList pullRequests={pullRequests} />
    </div>
  )
}
