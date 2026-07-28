'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, MessageSquare, Ship } from 'lucide-react'
import { approveFeature, rejectFeature } from '../actions'

interface ApprovalActionsProps {
  featureId: string
  pullRequestId: string
  isAlreadyShipped?: boolean
}

export function ApprovalActions({
  featureId,
  pullRequestId,
  isAlreadyShipped = false,
}: ApprovalActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [notes, setNotes] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleApprove = () => {
    setErrorMessage(null)
    startTransition(async () => {
      try {
        const res = await approveFeature({
          featureId,
          pullRequestId,
          notes,
        })
        if (res.success) {
          router.push('/dashboard/shipped')
          router.refresh()
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to approve feature.')
      }
    })
  }

  const handleReject = () => {
    if (!notes.trim()) {
      setErrorMessage('Please enter feedback explaining what needs to be fixed.')
      return
    }
    setErrorMessage(null)
    startTransition(async () => {
      try {
        const res = await rejectFeature({
          featureId,
          pullRequestId,
          notes,
        })
        if (res.success) {
          router.push(`/dashboard/feature-requests/${featureId}`)
          router.refresh()
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to reject feature.')
      }
    })
  }

  if (isAlreadyShipped) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center shadow-lg">
        <Ship className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
        <h3 className="text-lg font-bold text-emerald-200">This Feature is Shipped!</h3>
        <p className="text-xs text-emerald-300/70 mt-1">
          This feature has already been approved and marked as shipped to production.
        </p>
      </div>
    )
  }

  return (
    <div className="sticky bottom-6 z-30 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Ship className="h-4 w-4 text-indigo-400" />
            Human Reviewer Decision
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Approve to ship this feature, or reject with feedback to request developer fixes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRejectForm(!showRejectForm)}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-colors disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject / Request Fixes</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>Approve & Ship Feature</span>
          </button>
        </div>
      </div>

      {/* Notes / Feedback Field */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Approver Notes / Rejection Feedback {showRejectForm && <span className="text-rose-400">*</span>}</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            showRejectForm
              ? 'Describe what specific fixes or changes are required before shipping...'
              : 'Add optional approval notes or release comments...'
          }
          rows={3}
          className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {showRejectForm && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleReject}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-bold text-white transition-colors"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm Rejection & Send Feedback</span>
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
