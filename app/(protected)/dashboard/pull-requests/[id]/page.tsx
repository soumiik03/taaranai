// app/(protected)/dashboard/pull-requests/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPullRequestDetail } from '@/features/pull-requests/actions'
import { AIReviewMarkdown } from '@/features/pull-requests/components/ai-review-markdown'
import {
  ArrowLeft,
  GitPullRequest,
  ExternalLink,
  GitBranch,
  ShieldCheck,
  History,
  Sparkles,
} from 'lucide-react'

export default async function PullRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pullRequest = await getPullRequestDetail(id)

  if (!pullRequest) {
    notFound()
  }

  const latestRun = pullRequest.reviewRuns[0] || null

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/pull-requests"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Pull Requests List</span>
        </Link>

        {pullRequest.featureRequestId && (
          <Link
            href={`/dashboard/feature-requests/${pullRequest.featureRequestId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Linked Feature Request</span>
          </Link>
        )}
      </div>

      {/* PR Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                <GitPullRequest className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                PR #{pullRequest.number}: {pullRequest.title}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  pullRequest.status === 'READY_FOR_APPROVAL' || pullRequest.status === 'SHIPPED'
                    ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
                }`}
              >
                {pullRequest.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="font-semibold text-foreground">{pullRequest.repoFullName}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
                {pullRequest.branchName}
              </span>
              <span>•</span>
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

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/dashboard/review-history/${pullRequest.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors"
            >
              <History className="h-4 w-4" />
              <span>Full Review History</span>
            </Link>

            {pullRequest.status === 'READY_FOR_APPROVAL' && pullRequest.featureRequestId && (
              <Link
                href={`/dashboard/approval/${pullRequest.featureRequestId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Go to Human Approval</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* AI Review Markdown Output */}
      <AIReviewMarkdown
        latestRun={latestRun}
        prTitle={pullRequest.title}
        prBody={pullRequest.body}
        status={pullRequest.status}
      />
    </div>
  )
}
