'use client'

import { GitBranch } from 'lucide-react'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import {
  GitPullRequest,
  Search,
  ShieldCheck,
  AlertOctagon,
  Ship,
  Clock,
  ArrowRight,
} from 'lucide-react'

export interface PullRequestItem {
  id: string
  number: number
  repoFullName: string
  branchName: string
  title: string
  body: string | null
  htmlUrl: string
  headSha: string
  status: string
  featureRequestId: string | null
  featureRequestTitle: string | null
  updatedAt: Date
  latestIteration: number
  blockingCount: number
  nonBlockingCount: number
}

interface PullRequestsListProps {
  pullRequests: PullRequestItem[]
}

const statusBadges: Record<string, { label: string; style: string; icon: LucideIcon }> = {
  REVIEWING: {
    label: 'Reviewing',
    style: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
    icon: Clock,
  },
  FIX_NEEDED: {
    label: 'Fix Needed',
    style: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
    icon: AlertOctagon,
  },
  READY_FOR_APPROVAL: {
    label: 'Ready for Approval',
    style: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    icon: ShieldCheck,
  },
  SHIPPED: {
    label: 'Shipped',
    style: 'bg-teal-500/15 text-teal-300 ring-teal-500/30',
    icon: Ship,
  },
}

export function PullRequestsList({ pullRequests }: PullRequestsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  const filteredPRs = pullRequests.filter((pr) => {
    const matchesStatus = selectedStatus === 'ALL' || pr.status === selectedStatus
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      pr.title.toLowerCase().includes(query) ||
      pr.repoFullName.toLowerCase().includes(query) ||
      pr.branchName.toLowerCase().includes(query) ||
      (pr.featureRequestTitle && pr.featureRequestTitle.toLowerCase().includes(query))

    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PRs by title, repo, or branch..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All PRs' },
            { id: 'REVIEWING', label: 'Reviewing' },
            { id: 'FIX_NEEDED', label: 'Fix Needed' },
            { id: 'READY_FOR_APPROVAL', label: 'Ready' },
            { id: 'SHIPPED', label: 'Shipped' },
          ].map((filter) => {
            const isActive = selectedStatus === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedStatus(filter.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* PR Cards Grid */}
      {filteredPRs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground shadow-sm">
          <GitPullRequest className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-bold text-foreground">No Pull Requests Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery || selectedStatus !== 'ALL'
              ? 'Try adjusting your search query or status filter.'
              : 'Pull requests submitted to your connected GitHub repositories will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPRs.map((pr) => {
            const statusConfig = statusBadges[pr.status] || {
              label: pr.status,
              style: 'bg-muted text-muted-foreground',
              icon: GitPullRequest,
            }
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={pr.id}
                className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-indigo-500/40 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        #{pr.number}
                      </span>
                      <h3 className="text-base font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                        {pr.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusConfig.style}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                      <span className="font-semibold text-foreground">{pr.repoFullName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5" />
                        {pr.branchName}
                      </span>
                      {pr.latestIteration > 0 && (
                        <>
                          <span>•</span>
                          <span>Iteration #{pr.latestIteration}</span>
                        </>
                      )}
                    </div>

                    {pr.featureRequestTitle && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] font-semibold uppercase text-indigo-400">Linked Feature:</span>
                        <span className="truncate">{pr.featureRequestTitle}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions & Issue Badges */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-xs">
                      {pr.blockingCount > 0 && (
                        <span className="rounded-md bg-rose-500/15 px-2 py-1 font-semibold text-rose-300 ring-1 ring-rose-500/30">
                          {pr.blockingCount} Blocking
                        </span>
                      )}
                      {pr.nonBlockingCount > 0 && (
                        <span className="rounded-md bg-amber-500/15 px-2 py-1 font-semibold text-amber-300 ring-1 ring-amber-500/30">
                          {pr.nonBlockingCount} Non-Blocking
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/pull-requests/${pr.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30 transition-colors"
                      >
                        <span>View Review</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      {pr.status === 'READY_FOR_APPROVAL' && pr.featureRequestId && (
                        <Link
                          href={`/dashboard/approval/${pr.featureRequestId}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <span>Approve</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
