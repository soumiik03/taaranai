'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Trash2, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import { statusStyles } from '@/features/dashboard/lib/status-styles'
import { deleteFeatureRequestInline } from '../actions'

export interface FeatureRequestItem {
  id: string
  title: string
  description: string
  sourceType: string
  status: string
  createdAt: Date
}

interface FeatureRequestListProps {
  initialRequests: FeatureRequestItem[]
}

export function FeatureRequestList({ initialRequests }: FeatureRequestListProps) {
  const [requests, setRequests] = useState<FeatureRequestItem[]>(initialRequests)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this feature request? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    startTransition(async () => {
      try {
        await deleteFeatureRequestInline(id)
        setRequests((prev) => prev.filter((r) => r.id !== id))
      } finally {
        setDeletingId(null)
      }
    })
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/40">
        <Sparkles className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-base font-bold text-foreground">No Feature Requests Yet</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Create your first feature request to start the automated AI clarification, PRD generation, and review pipeline.
        </p>
        <Link
          href="/dashboard/feature-requests/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 mt-4 transition-colors"
        >
          <span>Create New Request</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const isDeletingThis = deletingId === r.id && isPending

        return (
          <div
            key={r.id}
            className="group relative flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-indigo-500/40 hover:shadow-md"
          >
            <Link
              href={`/dashboard/feature-requests/${r.id}`}
              className="flex-1 min-w-0 pr-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground text-base group-hover:text-indigo-400 transition-colors truncate">
                  {r.title}
                </span>
                <span className={statusStyles[r.status]}>{r.status}</span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {r.description}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-2 font-mono">
                <span className="capitalize">Source: {r.sourceType.toLowerCase()}</span>
                <span>•</span>
                <span>Created {new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => handleDelete(r.id, e)}
                disabled={isDeletingThis}
                title="Delete Feature Request"
                className="p-2 rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 disabled:opacity-50"
              >
                {isDeletingThis ? (
                  <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
