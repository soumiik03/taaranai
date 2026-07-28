'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  GitCommit,
  FileCode,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export interface ReviewIssueData {
  id: string
  severity: string
  title: string
  body: string
  file: string
  line: number | null
  resolved: boolean
  createdAt: Date
}

export interface ReviewRunData {
  id: string
  iteration: number
  status: string
  commitSha: string
  createdAt: Date
  issues: ReviewIssueData[]
}

interface ReviewHistoryListProps {
  reviewRuns: ReviewRunData[]
  prNumber: number
  repoFullName: string
}

export function ReviewHistoryList({
  reviewRuns,
  prNumber,
  repoFullName,
}: ReviewHistoryListProps) {
  const [expandedRunIds, setExpandedRunIds] = useState<Record<string, boolean>>(() => {
    // Expand the latest run by default
    const initial: Record<string, boolean> = {}
    if (reviewRuns.length > 0) {
      initial[reviewRuns[0].id] = true
    }
    return initial
  })

  const toggleRun = (runId: string) => {
    setExpandedRunIds((prev) => ({ ...prev, [runId]: !prev[runId] }))
  }

  if (reviewRuns.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
        <Clock className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-medium text-foreground">No Review Runs Recorded</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Review runs will automatically appear here once GitHub webhooks trigger the AI review pipeline.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviewRuns.map((run) => {
        const isExpanded = expandedRunIds[run.id] ?? false
        const blockingCount = run.issues.filter((i) => i.severity === 'blocking').length
        const nonBlockingCount = run.issues.filter((i) => i.severity === 'non-blocking').length
        const resolvedCount = run.issues.filter((i) => i.resolved).length

        const isApproved = run.status === 'READY_FOR_APPROVAL'

        return (
          <div
            key={run.id}
            className={`rounded-2xl border transition-all duration-200 shadow-md ${
              isApproved
                ? 'border-emerald-500/30 bg-card hover:border-emerald-500/50'
                : 'border-rose-500/30 bg-card hover:border-rose-500/50'
            }`}
          >
            {/* Header / Summary Bar */}
            <button
              onClick={() => toggleRun(run.id)}
              className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/30 rounded-t-2xl"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
                    isApproved
                      ? 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 ring-rose-500/30'
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-foreground">
                      Iteration #{run.iteration}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
                      }`}
                    >
                      {isApproved ? 'Ready for Approval' : 'Fix Needed'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <GitCommit className="h-3.5 w-3.5 text-indigo-400" />
                      {run.commitSha.substring(0, 7)}
                    </span>
                    <span>•</span>
                    <span>{new Date(run.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-0 border-border pt-3 sm:pt-0">
                <div className="flex items-center gap-2 text-xs">
                  {blockingCount > 0 && (
                    <span className="rounded-md bg-rose-500/15 px-2 py-1 font-medium text-rose-300 ring-1 ring-rose-500/30">
                      {blockingCount} Blocking
                    </span>
                  )}
                  {nonBlockingCount > 0 && (
                    <span className="rounded-md bg-amber-500/15 px-2 py-1 font-medium text-amber-300 ring-1 ring-amber-500/30">
                      {nonBlockingCount} Non-blocking
                    </span>
                  )}
                  {resolvedCount > 0 && (
                    <span className="rounded-md bg-emerald-500/15 px-2 py-1 font-medium text-emerald-300 ring-1 ring-emerald-500/30 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {resolvedCount} Fixed
                    </span>
                  )}
                  {run.issues.length === 0 && (
                    <span className="text-muted-foreground">0 Issues</span>
                  )}
                </div>

                <div className="text-muted-foreground">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
            </button>

            {/* Collapsible Details */}
            {isExpanded && (
              <div className="border-t border-border p-5 space-y-4 bg-muted/10 rounded-b-2xl">
                {run.issues.length === 0 ? (
                  <p className="text-xs text-emerald-400 flex items-center gap-2 py-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>No issues found! All PR checks passed clean.</span>
                  </p>
                ) : (
                  <div className="space-y-3">
                    {run.issues.map((issue) => {
                      const isBlocking = issue.severity === 'blocking'

                      return (
                        <div
                          key={issue.id}
                          className={`rounded-xl border p-4 transition-colors ${
                            issue.resolved
                              ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80'
                              : isBlocking
                              ? 'border-rose-500/25 bg-rose-950/20'
                              : 'border-amber-500/25 bg-amber-950/20'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 font-mono text-xs text-foreground">
                              <FileCode className="h-4 w-4 text-indigo-400" />
                              <span className="font-medium">{issue.file}</span>
                              {issue.line && (
                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                  Line {issue.line}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {issue.resolved && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
                                  <Check className="h-3 w-3" />
                                  Resolved in Next Pass
                                </span>
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                                  isBlocking
                                    ? 'bg-rose-500/20 text-rose-300 ring-rose-500/40'
                                    : 'bg-amber-500/20 text-amber-300 ring-amber-500/40'
                                }`}
                              >
                                {issue.severity}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm font-semibold text-foreground mb-1">
                            {issue.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {issue.body}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
