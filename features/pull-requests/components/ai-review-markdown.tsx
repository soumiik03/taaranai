'use client'

import { AlertOctagon, FileCode, CheckCircle2, AlertTriangle, ShieldCheck, GitCommit } from 'lucide-react'

interface Issue {
  id: string
  severity: string
  title: string
  body: string
  file: string
  line: number | null
  resolved: boolean
}

interface ReviewRun {
  id: string
  iteration: number
  status: string
  commitSha: string
  createdAt: Date
  issues: Issue[]
}

interface AIReviewMarkdownProps {
  latestRun: ReviewRun | null
  prTitle: string
  prBody: string | null
  status: string
}

export function AIReviewMarkdown({
  latestRun,
  prTitle,
  prBody,
  status,
}: AIReviewMarkdownProps) {
  if (!latestRun) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground text-xs">
        No AI review run recorded yet. The review will automatically start when a PR event is received.
      </div>
    )
  }

  const blockingIssues = latestRun.issues.filter((i) => i.severity === 'blocking')
  const nonBlockingIssues = latestRun.issues.filter((i) => i.severity === 'non-blocking')
  const resolvedIssues = latestRun.issues.filter((i) => i.resolved)

  return (
    <div className="space-y-6">
      {/* Run Summary Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
              status === 'READY_FOR_APPROVAL' || status === 'SHIPPED'
                ? 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 ring-rose-500/30'
            }`}
          >
            {status === 'READY_FOR_APPROVAL' || status === 'SHIPPED' ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <AlertOctagon className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                AI Review Pass — Iteration #{latestRun.iteration}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                  status === 'READY_FOR_APPROVAL' || status === 'SHIPPED'
                    ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 font-mono">
              <GitCommit className="h-3.5 w-3.5 text-indigo-400" />
              <span>Commit: {latestRun.commitSha}</span>
              <span>•</span>
              <span>Ran on {new Date(latestRun.createdAt).toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-rose-400 font-medium border border-rose-500/20">
            {blockingIssues.length} Blocking
          </span>
          <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-amber-400 font-medium border border-amber-500/20">
            {nonBlockingIssues.length} Non-Blocking
          </span>
        </div>
      </div>

      {/* SEPARATE HIGHLIGHTED BLOCKING ISSUES SECTION */}
      {blockingIssues.length > 0 && (
        <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-card to-background p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-rose-300 border-b border-rose-500/20 pb-3">
            <AlertOctagon className="h-5 w-5 text-rose-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {blockingIssues.length} Blocking {blockingIssues.length === 1 ? 'Issue' : 'Issues'} Highlighted
            </h3>
          </div>

          <div className="space-y-3">
            {blockingIssues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-2 transition-all hover:border-rose-500/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-rose-200">
                    <FileCode className="h-4 w-4 text-rose-400" />
                    <span className="font-bold">{issue.file}</span>
                    {issue.line && (
                      <span className="rounded bg-rose-900/60 px-1.5 py-0.5 text-[10px] text-rose-300">
                        Line {issue.line}
                      </span>
                    )}
                  </div>
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider ring-1 ring-rose-500/40">
                    Blocking
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground">{issue.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {issue.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NON-BLOCKING ISSUES SECTION */}
      {nonBlockingIssues.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 border-b border-amber-500/20 pb-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Non-Blocking Code Quality Suggestions
            </h3>
          </div>

          <div className="space-y-3">
            {nonBlockingIssues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-amber-300 mb-1">
                  <span>{issue.file} {issue.line ? `(Line ${issue.line})` : ''}</span>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                    Non-Blocking
                  </span>
                </div>
                <h4 className="text-sm font-medium text-foreground">{issue.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{issue.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL REVIEW SUMMARY MARKDOWN CARD */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
          Detailed AI Review Summary
        </h3>

        <div className="prose prose-invert max-w-none text-xs space-y-3 text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Review Target PR:</strong> {prTitle}
          </p>
          {prBody && (
            <div className="rounded-xl bg-muted/20 border border-border/60 p-3 text-foreground font-mono text-[11px]">
              {prBody}
            </div>
          )}

          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-4 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              AI Review Checklist Executed:
            </h4>
            <ul className="space-y-1 list-none pl-0">
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>PRD Acceptance Criteria & Scope Matching</span>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Edge Cases & Technical Contract Validation</span>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Security Vulnerability & Timing Attack Inspection</span>
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Breaking Schema & Type System Consistency</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
