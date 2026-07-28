'use client'

import { ExternalLink, History } from 'lucide-react'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Kanban,
  GitPullRequest,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { ReviewHistoryList } from '@/features/reviews/components/review-history-list'

interface ApprovalSummaryProps {
  data: {
    featureRequest: {
      id: string
      title: string
      description: string
      createdAt: Date
    }
    prd: {
      id: string
      problemStatement: string
      goals: unknown
      nonGoals: unknown
      userStories: unknown
      acceptanceCriteria: unknown
    } | null
    tasks: {
      id: string
      title: string
      description: string
      status: string
      priority: string
    }[]
    pullRequest: {
      id: string
      number: number
      repoFullName: string
      branchName: string
      title: string
      htmlUrl: string
      headSha: string
      status: string
    } | null
    reviewRuns: { id: string; iteration: number; status: string; commitSha: string; createdAt: Date; issues: { id: string; severity: string; title: string; body: string; file: string; line: number | null; resolved: boolean; createdAt: Date }[] }[]
    outstandingNonBlockingIssues: { id: string; file: string; line: number | null; title: string; body: string }[]
  }
}

export function ApprovalSummary({ data }: ApprovalSummaryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'prd' | 'tasks' | 'history'>('all')
  const { featureRequest, prd, tasks, pullRequest, reviewRuns, outstandingNonBlockingIssues } = data

  const goalsArray = Array.isArray(prd?.goals) ? prd.goals.filter((item): item is string => typeof item === 'string') : []
  const userStoriesArray = Array.isArray(prd?.userStories) ? prd.userStories.map((item) => typeof item === 'string' ? item : JSON.stringify(item)) : []

  return (
    <div className="space-y-8">
      {/* Feature Request & PR Context Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card to-background p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold text-foreground">{featureRequest.title}</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {featureRequest.description}
            </p>
          </div>

          {pullRequest && (
            <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
              <a
                href={pullRequest.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30 transition-colors"
              >
                <GitPullRequest className="h-3.5 w-3.5" />
                <span>PR #{pullRequest.number}: {pullRequest.repoFullName}</span>
                <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
              <span className="text-[11px] font-mono text-muted-foreground">
                Branch: {pullRequest.branchName} ({pullRequest.headSha.substring(0, 7)})
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto">
          {[
            { id: 'all', label: 'Full Overview', icon: Sparkles },
            { id: 'prd', label: 'PRD Specifications', icon: FileText },
            { id: 'tasks', label: `Tasks (${tasks.length})`, icon: Kanban },
            { id: 'history', label: `AI Review Log (${reviewRuns.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'prd' | 'tasks' | 'history')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Non-Blocking Issues Callout */}
      {outstandingNonBlockingIssues.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3 text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <h3 className="text-sm font-semibold">
              {outstandingNonBlockingIssues.length} Outstanding Non-Blocking Suggestion
              {outstandingNonBlockingIssues.length === 1 ? '' : 's'}
            </h3>
          </div>
          <div className="space-y-2">
            {outstandingNonBlockingIssues.map((issue) => (
              <div key={issue.id} className="rounded-xl border border-amber-500/20 bg-card p-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-amber-400 mb-1">
                  <span>{issue.file}</span>
                  {issue.line && <span>Line {issue.line}</span>}
                </div>
                <p className="font-semibold text-foreground">{issue.title}</p>
                <p className="text-muted-foreground mt-0.5">{issue.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRD Section */}
      {(activeTab === 'all' || activeTab === 'prd') && prd && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              Original PRD Specifications
            </h3>
            <Link
              href={`/dashboard/prd?id=${featureRequest.id}`}
              className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View in PRD Editor</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <div>
              <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1">
                Problem Statement
              </h4>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                {prd.problemStatement}
              </p>
            </div>

            {goalsArray.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1.5">
                  Core Goals
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {goalsArray.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}

            {userStoriesArray.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-1.5">
                  User Stories
                </h4>
                <div className="space-y-1.5">
                  {userStoriesArray.map((story, idx) => (
                    <div key={idx} className="bg-muted/20 p-2.5 rounded-lg border border-border/40 text-foreground">
                      {story}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generated Tasks Section */}
      {(activeTab === 'all' || activeTab === 'tasks') && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Kanban className="h-4 w-4 text-indigo-400" />
              Task Breakdown ({tasks.length} tasks)
            </h3>
            <Link
              href="/dashboard/tasks"
              className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View Task Board</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">{task.title}</span>
                  <span className="rounded bg-indigo-500/10 text-indigo-300 px-2 py-0.5 text-[10px] uppercase font-bold">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete AI Review History Section */}
      {(activeTab === 'all' || activeTab === 'history') && pullRequest && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-400" />
              Complete AI Review History
            </h3>
          </div>
          <ReviewHistoryList
            reviewRuns={reviewRuns}
          />
        </div>
      )}
    </div>
  )
}
