'use client'

import Link from 'next/link'
import { AlertOctagon, FileCode, ArrowRight, GitPullRequest, ExternalLink } from 'lucide-react'
import type { FixNeededState } from '../actions'

interface FixNeededBannerProps {
  data: FixNeededState
}

export function FixNeededBanner({ data }: FixNeededBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-background to-rose-950/20 p-6 shadow-xl shadow-rose-950/20 backdrop-blur-md">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
            <AlertOctagon className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-rose-200">Fix Needed - AI Review Blocking Issues</h3>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-medium text-rose-300 ring-1 ring-rose-500/30">
                Iteration #{data.iteration}
              </span>
            </div>
            <p className="text-xs text-rose-300/70 mt-0.5 flex items-center gap-2">
              <GitPullRequest className="h-3.5 w-3.5" />
              <span>PR #{data.pullRequestNumber}: {data.pullRequestTitle}</span>
              <a
                href={data.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-rose-400 hover:underline"
              >
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/review-history/${data.pullRequestId}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 px-4 py-2 text-xs font-semibold text-rose-200 transition-colors ring-1 ring-rose-500/30 shrink-0"
        >
          <span>View Review History</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Blocking Issues List */}
      <div className="mt-4 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-rose-400/80">
          {data.blockingIssues.length} Blocking {data.blockingIssues.length === 1 ? 'Issue' : 'Issues'} Must Be Addressed Before Next Push:
        </p>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {data.blockingIssues.map((issue) => (
            <div
              key={issue.id}
              className="group rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5 transition-all hover:border-rose-500/40 hover:bg-rose-950/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-mono text-xs text-rose-300">
                  <FileCode className="h-3.5 w-3.5 text-rose-400" />
                  <span className="font-semibold text-rose-200">{issue.file}</span>
                  {issue.line && (
                    <span className="rounded bg-rose-900/60 px-1.5 py-0.5 text-[10px] text-rose-300">
                      Line {issue.line}
                    </span>
                  )}
                </div>
                <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider ring-1 ring-rose-500/40">
                  Blocking
                </span>
              </div>

              <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-rose-100 transition-colors">
                {issue.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {issue.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-4 border-t border-rose-500/10 pt-3 text-center sm:text-left text-xs text-rose-300/60 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Pushing your fixes to this PR branch will automatically trigger a fresh AI re-review pass.</span>
      </div>
    </div>
  )
}
