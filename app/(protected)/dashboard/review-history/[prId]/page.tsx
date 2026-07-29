// app/(protected)/dashboard/review-history/[prId]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getReviewHistory } from '@/features/reviews/actions'
import { ReviewHistoryList } from '@/features/reviews/components/review-history-list'
import {
  ArrowLeft,
  GitPullRequest,
  ExternalLink,
  GitBranch,
  History,
  Sparkles,
} from 'lucide-react'

export default async function ReviewHistoryPage({
  params,
}: {
  params: Promise<{ prId: string }>
}) {
  const { prId } = await params
  const pullRequest = await getReviewHistory(prId)

  if (!pullRequest) {
    notFound()
  }

  const totalRuns = pullRequest.reviewRuns.length
  const latestRun = pullRequest.reviewRuns[0]
  const totalIssuesFound = pullRequest.reviewRuns.reduce(
    (acc, run) => acc + run.issues.length,
    0
  )
  const totalResolved = pullRequest.reviewRuns.reduce(
    (acc, run) => acc + run.issues.filter((i) => i.resolved).length,
    0
  )

  const isApproved = pullRequest.status === 'READY_FOR_APPROVAL'

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={
            pullRequest.featureRequestId
              ? `/dashboard/feature-requests/${pullRequest.featureRequestId}`
              : '/dashboard/pull-requests'
          }
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feature Request</span>
        </Link>

        {pullRequest.featureRequest && (
          <Link
            href={`/dashboard/feature-requests/${pullRequest.featureRequest.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Feature Request: {pullRequest.featureRequest.title}</span>
          </Link>
        )}
      </div>

      {/* Main Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                <History className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                PR Review History
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  isApproved
                    ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                    : pullRequest.status === 'FIX_NEEDED'
                    ? 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
                    : 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30'
                }`}
              >
                {pullRequest.status === 'READY_FOR_APPROVAL'
                  ? 'Ready for Approval'
                  : pullRequest.status === 'FIX_NEEDED'
                  ? 'Fix Needed'
                  : pullRequest.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <GitPullRequest className="h-4 w-4 text-indigo-400" />
                PR #{pullRequest.number}: {pullRequest.title}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1 font-mono">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                {pullRequest.branchName}
              </span>
              <span>|</span>
              <a
                href={pullRequest.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
              >
                <span>View on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Iterations
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalRuns}</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Current Status
            </p>
            <p
              className={`text-sm font-bold mt-1 ${
                isApproved ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {latestRun ? `Iteration #${latestRun.iteration} - ${latestRun.status}` : 'Pending'}
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Issues Flagged
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalIssuesFound}</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Issues Resolved
            </p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{totalResolved}</p>
          </div>
        </div>
      </div>

      {/* Review History Iteration List */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Iteration Log & Pass History
        </h2>
        <ReviewHistoryList
          reviewRuns={pullRequest.reviewRuns}
          prNumber={pullRequest.number}
          repoFullName={pullRequest.repoFullName}
        />
      </div>
    </div>
  )
}
